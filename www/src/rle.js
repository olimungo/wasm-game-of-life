const LIVE_CELL_LETTER = 'o';
const DEAD_CELL_LETTER = 'b';

export function Rle() {
    return {
        transformFromArrayOfLiveCells,
        transformToArrayOfLiveCells,
        addRow,
        addColumn,
    };

    function encode(colony) {
        let output = '';

        for (let row of colony) {
            const rows = row.join('').match(/1+|0+/g);

            // If the whole line is made of only o's or only b's
            if (rows.length === 1) {
                if (rows[0][0] === '1') {
                    output += `${input.column}${LIVE_CELL_LETTER}`;
                } else {
                    output += DEAD_CELL_LETTER;
                }
            } else {
                for (let [row, group] of Object(rows).entries()) {
                    const letter =
                        group[0] === '1' ? LIVE_CELL_LETTER : DEAD_CELL_LETTER;

                    // Do not add instructions at then end of a line for dead cells
                    if (row < rows.length - 1 || letter !== DEAD_CELL_LETTER) {
                        output += `${group.length}${letter}`;
                    }
                }
            }

            output += '$';
        }

        // Remove lines with only empty cells at the end of the output
        output = output.replace(/(b\$)*$/, '');

        // Replace the last '$' with a '!'
        output = output.replace(/\$$/, '!');

        return output;
    }

    function decode(input) {
        let rowCount, columnCount, rule;

        let lines = input
            .split('\n')
            .filter((line) => !line.match(/#/g) && line !== '');

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

        let compressedCells = lines.join('');

        // Remove last char if it's an exclamation mark
        if (compressedCells.match(/!$/g)) {
            compressedCells = compressedCells.slice(0, -1);
        }

        // Split on line separator
        compressedCells = compressedCells.split('$');

        // Extract instructions
        compressedCells = compressedCells.map((line) => line.match(/[0-9]*./g));

        // Transform instructions in a serie of '0' and '1'
        let inputPreDecoded = compressedCells.map((line) => {
            let newLine = '';

            line.map((instruction) => {
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

                    newLine += state.repeat(count);
                } else {
                    newLine += '#' + count;
                }
            });

            return newLine;
        });

        const inputDecoded = [];

        // If there are lines starting with a #, generates as many
        // "blank" lines as specified by the number after the #
        inputPreDecoded.forEach((line) => {
            const split = line.split('#');

            if (split.length === 1) {
                inputDecoded.push(line);
            } else {
                const count = parseInt(split[1]);

                for (let row = 0; row < count; ++row) {
                    inputDecoded.push('0');
                }
            }
        });

        return { rowCount, columnCount, rule, inputDecoded };
    }

    function transformToArrayOfLiveCells(input) {
        const colony = [];

        const { rowCount, columnCount, rule, inputDecoded } = decode(input);

        inputDecoded.forEach((line, row) => {
            for (let [column, state] of Object(line.split('')).entries()) {
                if (parseInt(state)) {
                    colony.push([row, column]);
                }
            }
        });

        return { rowCount, columnCount, rule, colony };
    }

    function transformFromArrayOfLiveCells(input) {
        const colony = [];

        for (let row = 0; row < input.row; row++) {
            colony.push(Array(input.column).fill('0'));
        }

        for (let cell of input.colony) {
            colony[cell[0]][cell[1]] = '1';
        }

        return encode(colony);
    }

    function addRow(colony, count) {
        return colony.map((cell) => [cell[0] + count, cell[1]]);
    }

    function addColumn(colony, count) {
        return colony.map((cell) => [cell[0], cell[1] + count]);
    }
}
