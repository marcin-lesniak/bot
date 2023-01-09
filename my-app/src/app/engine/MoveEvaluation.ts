import { Move } from "chess.js";
import { ScorePosition } from "../components/score-position";

export class MoveEvaluation {
    public check = 0;
    public scoreList:Map<string,number> = new Map();

    constructor(public move:Move, public score: number = 0) {
    };
}