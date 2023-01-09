import { ScorePosition } from "./score-position";
import { Chess, ChessInstance } from 'chess.js';

export class OpenLine implements ScorePosition {

    constructor(private chess: ChessInstance) {}

    public description(): string {
        return "OpenLine";
    }

    public score(): number {
        let score = 0;
        let board = this.chess.board();
        for(let i=0; i<8; i++) {
            let isOpenLine = true;
            let isSemiOpenLineForWhite = true;
            let isSemiOpenLineForBlack = true;
            let countWhiteOnFile = 0;
            let countBlackOnFile = 0;
            for(let j=0; j<8; j++) {
                let squere = board[j][i];
                if(squere?.type === "r" || squere?.type === "q" ) {
                    if(squere?.color === "w" && j>1) {
                        countWhiteOnFile++;
                    } else if(squere.color === "b" && j<6) {
                        countBlackOnFile++;
                    }
                } else if(squere?.type === "p") {
                    isOpenLine = false;
                    if(squere?.color === "w") {
                        isSemiOpenLineForWhite = false;
                    } else {
                        isSemiOpenLineForBlack = false;
                    }
                }
            }

            if(isOpenLine) {
                score += 0.1*(countWhiteOnFile - countBlackOnFile);
            } else if(isSemiOpenLineForWhite) {
                score += 0.05*countWhiteOnFile;
            } else if(isSemiOpenLineForBlack) {
                score -= 0.05*countBlackOnFile;
            }
        }
        
        return score;
    }
}