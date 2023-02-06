import { Chess } from "chess.js";
import { MoveEvaluation } from "../engine/MoveEvaluation";

export class Castel {

    constructor(private chess: Chess) {}

    public evaluateCastel(move: MoveEvaluation) {
        if(move.move.san.includes("O-O")) {
            if(this.chess.turn() === "b") {
                return 0.1;
            } else {
                return -0.1;
            }
            
        }

        return 0;
    }
}