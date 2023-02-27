import { ScorePosition } from "./score-position";
import { Chess } from 'chess.js';
import { Material } from "./material";

export class PawnsStructures implements ScorePosition {

    constructor(private chess: Chess, private material: Material) {}

    public description(): string {
        return "PawnsStructures";
    }
    
    public score(): number {
        let score = 0;
        score += this.scoreDoublePawns();
        return score;
    }
    
    private scoreDoublePawns() : number {
        let score = 0;
        let countWhite;
        let countBlack;
        for(let i=0; i<8; i++) {
            countWhite = 0;
            countBlack = 0;
            for(let j=1; j<7; j++) {
                if(this.chess.board()[j][i]?.type === 'p') {
                    if(this.chess.board()[j][i]?.color === 'w') {
                        countWhite++;
                    } else {
                        countBlack++;
                    }
                }
            }
            score += countBlack > 1 ? (countBlack - 1)*0.1 : 0;
            score -= countWhite > 1 ? (countWhite - 1)*0.1 : 0;
        }
        // for(let i=0; i<this.material.whitePawnsPositions.length-1; i++) {
        //     if(this.material.whitePawnsPositions[i].x === this.material.whitePawnsPositions[i+1].x) {
        //         score -= 0.1;
        //     }
        // }

        // for(let i=0; i<this.material.blackPawnsPositions.length-1; i++) {
        //     if(this.material.blackPawnsPositions[i].x === this.material.blackPawnsPositions[i+1].x) {
        //         score += 0.1;
        //     }
        // }

        return score;
    }

    
}