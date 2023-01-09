import { ScorePosition } from "./score-position";
import { Chess, ChessInstance, PieceType, Square } from 'chess.js';
import { MaterialCount } from "./materialCount";

export class Material implements ScorePosition {

    public whiteCount = new MaterialCount();
    public blackCount = new MaterialCount();
    public whiteKingPosition = {x:-1, y:-1};
    public blackKingPosition = {x:-1, y:-1};

    constructor(private chess: ChessInstance) {}

    public description(): string {
        return "Material";
    }

    public score(): number {
      let score = 0;
      this.whiteCount.clear();
      this.blackCount.clear();
  
      let board: Array<Array<{ type: PieceType; color: "w" | "b" } | null>> = this.chess.board();
      for(let i=0; i<8; i++) {
          for(let j=0; j<8; j++) {
              if(board[i][j]) {
                  if(board[i][j]?.color == 'w') {
                      this.countPieceMaterial(board[i][j]?.type, this.whiteCount);
                      if(board[i][j]?.type === 'k') {
                        this.whiteKingPosition = {x:i, y:j};
                      }
                  } else {
                      this.countPieceMaterial(board[i][j]?.type, this.blackCount);
                      if(board[i][j]?.type === 'k') {
                        this.blackKingPosition = {x:i, y:j};
                      }
                  }
              }
          }
      }

      score = this.whiteCount.score() - this.blackCount.score();

      return score;
  }

    public countPieceMaterial(piece: PieceType | undefined, count: MaterialCount) {
      switch(piece) {
        case "p": 
          count.pawns++;
          break;
        case "n":
            count.knighs++;
            break;
        case "b":
            count.bishops++;
            break;
        case "r": 
          count.rooks++;
          break;
        case "q": 
          count.queens++;
          break;
      }
    }

    public evaluatePieceMaterial(piece: PieceType | undefined) {
        switch(piece) {
          case "p": return 1;
          
          case "n": 
            return 3;
          case "b":
            if(this.chess.turn() == "w" && this.blackCount.bishops == 2) {
              return 3.5;
            } else if(this.chess.turn() == "b" && this.whiteCount.bishops == 2) {
              return 3.5
            } else {
              return 3;
            }
          
          case "r": return 5;
          case "q": return 9;
          
          default: return 0;
          
        }
      }
}