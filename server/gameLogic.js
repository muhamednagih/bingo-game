function generateBoard(boardSize = 5) {
    const totalNumbers = boardSize * boardSize;
    const numbers = Array.from({ length: totalNumbers }, (_, i) => i + 1);
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    return numbers;
}

function checkLines(board, calledNumbers, boardSize = 5) {
    const calledSet = new Set(calledNumbers);
    let lines = 0;

    // Check rows
    for (let i = 0; i < boardSize; i++) {
        let rowComplete = true;
        for (let j = 0; j < boardSize; j++) {
            if (!calledSet.has(board[i * boardSize + j])) {
                rowComplete = false;
                break;
            }
        }
        if (rowComplete) lines++;
    }

    // Check columns
    for (let j = 0; j < boardSize; j++) {
        let colComplete = true;
        for (let i = 0; i < boardSize; i++) {
            if (!calledSet.has(board[i * boardSize + j])) {
                colComplete = false;
                break;
            }
        }
        if (colComplete) lines++;
    }

    return lines;
}

module.exports = {
    generateBoard,
    checkLines
};
