export function Rle() {
    return {
        transformToArrayOfLiveCells,
        addRow,
        addColumn,
    };

    function decode(input) {
        let lines = input
            .split('\n')
            .filter((line) => !line.match(/#/g) && line !== '');

        const definition = lines.shift();
        const coords = definition.match(/[x|y] = [0-9]*/g);
        const columnCount = parseInt(coords[0].split(' = ')[1]);
        const rowCount = parseInt(coords[1].split(' = ')[1]);

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
                const [letter] = instruction.match(/[a-z]|[A-Z]/g);

                if (letter === 'o') {
                    state = '1';
                }

                newLine += state.repeat(count);
            });

            return newLine;
        });

        return { rowCount, columnCount, inputDecoded };
    }

    function transformToArrayOfLiveCells(input) {
        const cells = [];

        const { rowCount, columnCount, inputDecoded } = decode(input);

        inputDecoded.forEach((line, row) => {
            let column = 0;

            for (const state of line) {
                if (parseInt(state)) {
                    cells.push([row, column]);
                }

                column++;
            }
        });

        return { rowCount, columnCount, cells };
    }

    function addRow(input, count) {
        return input.map((cell) => [cell[0] + count, cell[1]]);
    }

    function addColumn(input, count) {
        return input.map((cell) => [cell[0], cell[1] + count]);
    }
}
