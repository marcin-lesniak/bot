import { ScorePosition } from "./score-position";
import { Chess, ChessInstance } from 'chess.js';

export class LastRanks implements ScorePosition {

    constructor(private chess: ChessInstance) {}

    public description(): string {
        return "LastRanks";
    }
    
    public score(): number {
        let score = 0;
        let board = this.chess.board();
        let countOfRooksAndQueenOnRank = 0;
        for(let i=0; i<2; i++) {
            for(let j=0; j<8; j++) {
                let squere = board[i][j];
                if((squere?.type === "r" || squere?.type === "q" ) && squere?.color === "w") {
                    countOfRooksAndQueenOnRank++;
                }
            }
        }

        for(let i=6; i<8; i++) {
            for(let j=0; j<8; j++) {
                let squere = board[i][j];
                if((squere?.type === "r" || squere?.type === "q" ) && squere?.color === "b") {
                    countOfRooksAndQueenOnRank--;
                }
            }
        }

        score += 0.25*countOfRooksAndQueenOnRank;
        
        return score;
    }
}