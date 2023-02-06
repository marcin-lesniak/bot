export class MaterialCount {

    public pawns = 0;
    public knighs = 0;
    public bishops = 0;
    public rooks = 0;
    public queens = 0;

    constructor() {}

    public clear() {
        this.pawns = 0;
        this.knighs = 0;
        this.bishops = 0;
        this.rooks = 0;
        this.queens = 0;
    }

    public score() {
        let score = this.pawns + this.knighs*3 + this.bishops*3 + this.rooks*5 + this.queens*9;
        if(this.bishops == 2) {
            score += 0.5;
        }
        return score;
    }

    public getAllPeaces() {
        return this.knighs + this.bishops + this.rooks + this.queens;
    }
} 