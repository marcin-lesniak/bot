import { ChessInstance, PieceType } from "chess.js";
import { ScorePosition } from "./score-position";

export class Peaces implements ScorePosition {

    constructor(private chess: ChessInstance) {}

    public description(): string {
        return "Peaces";
    }
    
    public score(): number {
        let score = 0;

        for(let i=0; i<8; i++) {
            if(this.isPeaceOnFirstLine(this.chess.board()[7][i], 'w')) {
                score -= 0.1;
            }
            if(this.isPeaceOnFirstLine(this.chess.board()[0][i], 'b')) {
                score += 0.1;
            }
        }

        return score;
    }

    private isPeaceOnFirstLine(peace:{ type: PieceType; color: "w" | "b" } | null, color: "w" | "b"): boolean {
        if(peace?.color == color && 
            (peace?.type === "n"
            || peace?.type === "b"
            || peace?.type === "q")) {
                return true;
            }

        return false;
    }
}