import { ScorePosition } from "./score-position";
import { Chess, Square } from 'chess.js';
import { Material } from "./material";

export class AttackPeaces implements ScorePosition {

    constructor(private chess: Chess,
        private material: Material,
        private SQUARES: string[]) {}

    public description(): string {
        return "AttackgPeaces";
    }
    
    public score(): number {
        return 0.02*(this.countForWhite() - this.countForBlack());
    }

    private countForWhite(): number {
        let count = 0;
        this.material.getAllBlackPeacesPosition().forEach((p) => {
            let field = this.SQUARES[p.y*8+p.x];
            if(this.chess.isAttacked(field as Square, 'w')) {
                count++;
            }
        })

        return count;
    }

    private countForBlack(): number {
        let count = 0;
        this.material.getAllWhitePeacesPosition().forEach((p) => {
            let field = this.SQUARES[p.y*8+p.x];
            if(this.chess.isAttacked(field as Square, 'b')) {
                count++;
            }
        })

        return count;
    }
}