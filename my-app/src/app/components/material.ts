import { ScorePosition } from "./score-position";
import { Chess, PieceSymbol } from 'chess.js';
import { MaterialCount } from "./materialCount";

export class Material implements ScorePosition {

    public whiteCount = new MaterialCount();
    public blackCount = new MaterialCount();
    public whiteKingPosition = {x:-1, y:-1};
    public whitePawnsPositions = Array<any>();
    public blackKingPosition = {x:-1, y:-1};
    public blackPawnsPositions = Array<any>();

    constructor(private chess: Chess) {}

    public description(): string {
        return "Material";
    }

    public score(): number {
      let score = 0;
      this.whiteCount.clear();
      this.blackCount.clear();

      this.checkMaterial();
      score = this.whiteCount.score() - this.blackCount.score();

      return score;
  }

  private checkMaterial() {
    let board = this.chess.board();
    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {
          let position = board[i][j];
          if(position) {
              if(position?.color == 'w') {
                  this.countPieceMaterial(position?.type, this.whiteCount);
                  if(position?.type === 'k') {
                    this.whiteKingPosition = {x:j, y:i};
                  } else if(position?.type === 'p') {
                    this.whitePawnsPositions.push({x:j, y:i});
                  }
              } else {
                  this.countPieceMaterial(position?.type, this.blackCount);
                  if(position?.type === 'k') {
                    this.blackKingPosition = {x:j, y:i};
                  } else if(position?.type === 'p') {
                    this.blackPawnsPositions.push({x:j, y:i});
                  }
              }
          }
        }
    }
    this.whitePawnsPositions.sort((a, b) => {
      return a.x - b.x;
    })
    this.blackPawnsPositions.sort((a, b) => {
      return a.x - b.x;
    })
  }

    public countPieceMaterial(piece: PieceSymbol | undefined, count: MaterialCount) {
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

    public evaluatePieceMaterial(piece: PieceSymbol | undefined) {
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