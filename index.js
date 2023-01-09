import {express} from 'express';
// const express = require('express')
const app = express();
// const Chess = require('chess.js');
import { Chess } from 'chess.js';

app.get('/', (req, res) => {
    res.send('Hello World!')
    const chess = new Chess()
    while (!chess.game_over()) {
        const moves = chess.moves()
        const move = moves[Math.floor(Math.random() * moves.length)]
        chess.move(move)
    }
    res.send(chess.pgn());
});

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});