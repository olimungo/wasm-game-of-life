const LIVE_CELL_LETTER = 'o';
const DEAD_CELL_LETTER = 'b';
const LINE_SEPARATOR = '$';

export function Rle() {
    return {
        transformToArrayOfLiveCells,
        transformFromArrayOfLiveCells,
        translateLiveCells,
    };

    function transformToArrayOfLiveCells(input) {
        let error, rowCount, columnCount, rule, inputDecoded;
        const colony = [];

        if (!input) {
            return {
                error: `Empty input. Specify a Run-Length Encoded string like '23bo$bobo2b5o$3$5o!'`,
                rowCount,
                columnCount,
                rule,
                colony,
            };
        }

        ({ error, rowCount, columnCount, rule, inputDecoded } = decode(input));

        if (error) {
            return { error, rowCount, columnCount, rule, colony };
        }

        inputDecoded.forEach((line, row) => {
            for (let [column, state] of Object(line.split('')).entries()) {
                if (parseInt(state)) {
                    colony.push([row, column]);
                }
            }
        });

        if (!rowCount) {
            const { maxRow, maxColumn } = getMaxRowColumn(colony);
            rowCount = maxRow + 1;
            columnCount = maxColumn + 1;
        }

        return { error: '', rowCount, columnCount, rule, colony };
    }

    function transformFromArrayOfLiveCells(textColony) {
        const bitColony = [];
        let colony = [];

        if (!textColony) {
            return {
                error: `Empty input. Expected something like '[[1, 32], [2, 55], [3, 55]]'`,
                colony,
            };
        }

        try {
            colony = JSON.parse(textColony);

            if (!Array.isArray(colony)) {
                throw new Error();
            }
        } catch (error) {
            return {
                error: `Malformed array of cells. Expected something like '[[1, 32], [2, 55], [3, 55]]'`,
                colony,
            };
        }

        const { maxRow, maxColumn } = getMaxRowColumn(colony);

        // Pepare a bit array of dead cells
        for (let row = 0; row < maxRow + 1; row++) {
            bitColony.push(Array(maxColumn + 1).fill('0'));
        }

        // Set the alive cells in the array
        for (let cell of colony) {
            try {
                bitColony[cell[0]][cell[1]] = '1';
            } catch (error) {
                return {
                    error: `Malformed array of cells. Expected something like '[[1, 32], [2, 55], [3, 55]]'`,
                    colony,
                };
            }
        }

        return { error: '', colony: encode(bitColony) };
    }

    function encode(bitColony) {
        let output = '';

        for (let bitRow of bitColony) {
            output += encodeRow(bitRow);
        }

        // Remove lines with only empty cells at the end of the output
        output = output.replace(/(b\$)*$/, '');

        // Compact multiple blank lines (like $b$b$b$ becomes 3$)
        let emptyLines = output.match(/\$b(\$b)+\$/g);

        if (emptyLines) {
            emptyLines = emptyLines.sort((a, b) => (a > b ? -1 : 1));

            emptyLines.forEach((item) => {
                output = output.replace(item, (item.length - 1) / 2 + '$');
            });
        }

        // Replace the last '$' with a '!'
        output = output.replace(/\$$/, '!');

        return output;
    }

    function decode(rleInput) {
        let rleLines = rleInput
            .split('\n')
            // Remove lines starting with a '#' and empty lines
            .filter((line) => !line.match(/#/g) && line !== '');

        // Extract information about the number of rows, columns and the rule
        const { rowCount, columnCount, rule } = decodeProperties(rleLines);

        let instructions = rleLines.join('');

        // Remove last char if it's an exclamation mark
        if (instructions.match(/!$/g)) {
            instructions = instructions.slice(0, -1);
        }

        // Split on line separator
        instructions = instructions.split(LINE_SEPARATOR);

        // Extract instructions
        instructions = instructions.map((line) => line.match(/[0-9]*./g));

        // Transform instructions in a serie of '0' and '1'
        const { error, decodedCells } = applyInsructions(instructions);

        if (error) {
            return { error, rowCount, columnCount, rule, inputDecoded: [] };
        }

        // If there are lines starting with a #, generates as many
        // "blank" lines as specified by the number after the #
        const colony = applyBlankLines(decodedCells);

        return { error: '', rowCount, columnCount, rule, inputDecoded: colony };
    }

    function encodeRow(bitRow) {
        let rowEncoded = '';
        const bitGroups = bitRow.join('').match(/1+|0+/g);

        // If the line is made of only 1's or only 0's
        if (bitGroups.length === 1) {
            if (bitGroups[0][0] === '1') {
                rowEncoded += `${
                    bitGroups[0].length > 1 ? bitGroups[0].length : ''
                }${LIVE_CELL_LETTER}`;
            } else {
                rowEncoded += DEAD_CELL_LETTER;
            }
        } else {
            for (let [row, group] of Object(bitGroups).entries()) {
                const letter =
                    group[0] === '1' ? LIVE_CELL_LETTER : DEAD_CELL_LETTER;

                // Do not add instructions at then end of a line for dead cells
                if (row < bitGroups.length - 1 || letter !== DEAD_CELL_LETTER) {
                    rowEncoded += `${
                        group.length > 1 ? group.length : ''
                    }${letter}`;
                }
            }
        }

        return rowEncoded + '$';
    }

    function decodeProperties(lines) {
        let rowCount = 0,
            columnCount = 0,
            rule = '';

        // If there's a first line starting with an 'x', it is the
        // array definition
        if (lines.length > 0 && lines[0].match(/^x/g)) {
            const definition = lines.shift();
            const coords = definition.match(/[x|y]\s*=\s*[0-9]*/g);
            rule = definition.match(/rule.*/g);

            if (rule) {
                [rule] = rule;
                rule = rule.split('=')[1].trim();
            }

            if (coords) {
                columnCount = parseInt(coords[0].split('=')[1]);
                rowCount = parseInt(coords[1].split('=')[1]);
            }
        }

        return { rowCount, columnCount, rule };
    }

    function applyInsructions(encodedCells) {
        let decodedCells = [];

        try {
            decodedCells = encodedCells.map((instructions) => {
                let decodedCell = '';

                instructions.map((instruction) => {
                    let state = '0';

                    const count = parseInt(instruction) || 1;
                    const matchedLetter = instruction.match(/[a-z]|[A-Z]/g);

                    // If there's just a number and no letter on the line,
                    // then keep the number so to generate as many "blank"
                    // lines afterwards
                    if (matchedLetter) {
                        const [letter] = matchedLetter;

                        if (letter !== DEAD_CELL_LETTER) {
                            state = '1';
                        }

                        decodedCell += state.repeat(count);
                    } else {
                        decodedCell += '#' + count;
                    }
                });

                return decodedCell;
            });
        } catch (error) {
            return {
                error: `Malformed RLE. There should be a character before and after a '${LINE_SEPARATOR}'`,
                decodedCells,
            };
        }

        return { error: '', decodedCells };
    }

    function applyBlankLines(decodedCells) {
        const colony = [];

        decodedCells.forEach((line) => {
            const split = line.split('#');

            if (split.length === 1) {
                colony.push(line);
            } else {
                colony.push(split[0]);

                const count = parseInt(split[1]);

                for (let row = 0; row < count; ++row) {
                    colony.push('0');
                }
            }
        });

        return colony;
    }

    function getMaxRowColumn(colony) {
        let maxRow = 0;
        let maxColumn = 0;

        for (let cell of colony) {
            maxRow = cell[0] > maxRow ? cell[0] : maxRow;
            maxColumn = cell[1] > maxColumn ? cell[1] : maxColumn;
        }

        return { maxRow, maxColumn };
    }

    function translateLiveCells(colony, x, y) {
        return colony.map((cell) => [cell[0] + y, cell[1] + x]);
    }
}
