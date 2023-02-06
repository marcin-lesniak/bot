import { ScorePosition } from "./score-position";
import { Chess } from 'chess.js';

export class LastRanks implements ScorePosition {

    constructor(private chess: Chess) {}

    public description(): string {
        return "LastRanks";
    }
    
    public score(): number {
        return 0.25*(this.countForWhite() - this.countForBlack());
    }

    private countForWhite(): number {
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

        return countOfRooksAndQueenOnRank;
    }

    private countForBlack(): number {
        let board = this.chess.board();
        let countOfRooksAndQueenOnRank = 0;

        for(let i=6; i<8; i++) {
            for(let j=0; j<8; j++) {
                let squere = board[i][j];
                if((squere?.type === "r" || squere?.type === "q" ) && squere?.color === "b") {
                    countOfRooksAndQueenOnRank++;
                }
            }
        }

        return countOfRooksAndQueenOnRank;
    }
}