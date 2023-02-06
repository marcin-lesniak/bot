import { ScorePosition } from "./score-position";
import { Chess } from 'chess.js';

export class PassedPawn implements ScorePosition {

    constructor(private chess: Chess) {}

    public description(): string {
        return "PassedPawn";
    }
    
    public score(): number {
        let score = 0;
        score += this.scoreWhite();
        score += this.scoreBlack();
        return score;
    }
    
    private scoreWhite() : number {
        let score = 0;
        let board = this.chess.board();
        let isPassed: Boolean[] = new Array();
        let unKnown = 8;

        for(let i=1; i<7; i++) {
            if(unKnown == 0) {
                break;
            }
            for(let j=0; j<8; j++) {
                let squere = board[i][j];
                if(squere?.type === "p") {
                    if(squere?.color === "b") {
                        isPassed[j] = false;
                        unKnown--;

                        if(j>0 && isPassed[j-1] == undefined) {
                            isPassed[j-1] = false;
                            unKnown--;
                        }

                        if(j<7 && isPassed[j+1] == undefined && !this.isWhitePawn(board[i][j+1])) {
                            isPassed[j+1] = false;
                            unKnown--;
                        }
                    } else if (squere?.color === "w" && isPassed[j] != false) {
                        isPassed[j] = true;
                        score += (7-i)*(7-i)*0.02;
                        unKnown--;
                    }
                }
            }
        }

        return score;
    }

    private scoreBlack() : number {
        let score = 0;
        let board = this.chess.board();
        let isPassed: Boolean[] = new Array();
        let unKnown = 8;

        for(let i=7; i>0; i--) {
            if(unKnown == 0) {
                break;
            }
            for(let j=0; j<8; j++) {
                let squere = board[i][j];
                if(squere?.type === "p") {
                    if(squere?.color === "w") {
                        isPassed[j] = false;
                        unKnown--;

                        if(j>0 && isPassed[j-1] == undefined) {
                            isPassed[j-1] = false;
                            unKnown--;
                        }

                        if(j<7 && isPassed[j+1] == undefined && !this.isBlackPawn(board[i][j+1])) {
                            isPassed[j+1] = false;
                            unKnown--;
                        }
                    } else if (squere?.color === "b" && isPassed[j] != false) {
                        isPassed[j] = true;
                        score -= i*i*0.02;
                        unKnown--;
                    }
                }
            }
        }

        return score;
    }

    private isWhitePawn(squere:any) {
        return squere?.type === "p"  && squere?.color === "w";
    }

    private isBlackPawn(squere:any) {
        return squere?.type === "p"  && squere?.color === "b";
    }
}