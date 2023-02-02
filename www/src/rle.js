const DEAD_CELL_LETTER = 'b';

export function Rle() {
    return {
        transformToArrayOfLiveCells,
        addRow,
        addColumn,
    };

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
        const inputDecoded = compressedCells.map((line) => {
            let newLine = '';

            line.map((instruction) => {
                let state = '0';

                const count = parseInt(instruction) || 1;
                const matchedLetter = instruction.match(/[a-z]|[A-Z]/g);

                // If there's no letter in the instruction, we are in a
                // 'Houston, I believe we've had a problem here' situation.
                // If that happens, just scrub the current instruction
                if (matchedLetter) {
                    const [letter] = matchedLetter;

                    if (letter !== DEAD_CELL_LETTER) {
                        state = '1';
                    }

                    newLine += state.repeat(count);
                }
            });

            return newLine;
        });

        return { rowCount, columnCount, rule, inputDecoded };
    }

    function transformToArrayOfLiveCells(input) {
        const cells = [];

        const { rowCount, columnCount, rule, inputDecoded } = decode(input);

        inputDecoded.forEach((line, row) => {
            for (let [column, state] of Object(line.split('')).entries()) {
                if (parseInt(state)) {
                    cells.push([row, column]);
                }
            }
        });

        return { rowCount, columnCount, rule, cells };
    }

    function addRow(input, count) {
        return input.map((cell) => [cell[0] + count, cell[1]]);
    }

    function addColumn(input, count) {
        return input.map((cell) => [cell[0], cell[1] + count]);
    }
}
