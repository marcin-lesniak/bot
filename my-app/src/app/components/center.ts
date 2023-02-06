import { ScorePosition } from "./score-position";
import { Chess } from 'chess.js';

export class Center implements ScorePosition {

    constructor(private chess: Chess) {}

    public description(): string {
        return "Center";
    }

    public score(): number {
        return this.scoreWhiteCenter() + this.scoreBlackCenter();
    }

    private scoreWhiteCenter(): number {
        let score = 0;
        if(this.chess.get('c4')?.color === 'w' && this.chess.get('c4')?.type === 'p') {
            score += 0.1;
        }
        if(this.chess.get('d4')?.color === 'w' && this.chess.get('d4')?.type === 'p') {
            score += 0.1;
        }
        if(this.chess.get('e4')?.color === 'w' && this.chess.get('e4')?.type === 'p') {
            score += 0.1;
        }
        if(this.chess.get('f4')?.color === 'w' && this.chess.get('f4')?.type === 'p') {
            score += 0.1;
        }

        return score;
    }

    private scoreBlackCenter(): number {
        let score = 0;
        if(this.chess.get('c5')?.color === 'b' && this.chess.get('c5')?.type === 'p') {
            score -= 0.1;
        }
        if(this.chess.get('d5')?.color === 'b' && this.chess.get('d5')?.type === 'p') {
            score -= 0.1;
        }
        if(this.chess.get('e5')?.color === 'b' && this.chess.get('e5')?.type === 'p') {
            score -= 0.1;
        }
        if(this.chess.get('f5')?.color === 'b' && this.chess.get('f5')?.type === 'p') {
            score -= 0.1;
        }
        
        return score;
    }
}