import { Chess } from 'chess.js';

const chess = new Chess()

console.log("start");
// var moves = chess.moves();
// console.log(moves);

game();
//randomGame();

function game() {
    while (!chess.game_over()) {
        var moves = chess.moves();
        let bestScore = -1;
        let candidateMoves = [];
        moves.forEach(function(value) {
            let score = evaluate(value);
            // console.log(value, score);
            if(score > bestScore) {
                bestScore = score;
                candidateMoves = [];
                candidateMoves.push(value);
            } else if(score == bestScore) {
                candidateMoves.push(value);
            }
        })

        let bestMove = candidateMoves[Math.floor(Math.random() * candidateMoves.length)]
        chess.move(bestMove)
    }
    console.log(chess.pgn())
}

function evaluate(value) {
    chess.move(value);
    let score = 0;
    if(chess.in_checkmate()) {
        score += 100;
    } else if(chess.in_check()) {
        score += 10;
    }

    chess.undo();

    return score;
}

function randomGame() {
    while (!chess.game_over()) {
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)]
        chess.move(move)
    }
    console.log(chess.pgn())
}