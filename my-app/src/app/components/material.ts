import { ScorePosition } from "./score-position";
import { Chess, PieceSymbol } from 'chess.js';
import { MaterialCount } from "./materialCount";

export class Material implements ScorePosition {

    public whiteCount = new MaterialCount();
    public blackCount = new MaterialCount();
    public whiteKingPosition = {x:-1, y:-1};
    public whitePawnsPositions = Array<any>();
    public whiteQueensPositions = Array<any>();
    public whiteRooksPositions = Array<any>();
    public whiteBishopsPositions = Array<any>();
    public whiteKnightsPositions = Array<any>();
    public blackKingPosition = {x:-1, y:-1};
    public blackPawnsPositions = Array<any>();
    public blackQueensPositions = Array<any>();
    public blackRooksPositions = Array<any>();
    public blackBishopsPositions = Array<any>();
    public blackKnightsPositions = Array<any>();

    constructor(private chess: Chess) {}

    public description(): string {
        return "Material";
    }

    public score(): number {
      let score = 0;

      this.checkMaterial();
      score = this.whiteCount.score() - this.blackCount.score();

      return score;
  }

  private checkMaterial() {
    this.clear();

    let board = this.chess.board();
    for(let i=0; i<8; i++) {
        for(let j=0; j<8; j++) {
          let position = board[i][j];
          if(position) {
              if(position?.color == 'w') {
                  this.countPieceMaterial(position?.type, this.whiteCount);
                  if(position?.type === 'k') {
                    this.whiteKingPosition = {x:j, y:i};
                  } else if (position?.type === 'q') {
                    this.whiteQueensPositions.push({x:j, y:i});
                  } else if (position?.type === 'r') {
                    this.whiteRooksPositions.push({x:j, y:i});
                  } else if (position?.type === 'b') {
                    this.whiteBishopsPositions.push({x:j, y:i});
                  } else if (position?.type === 'n') {
                    this.whiteKnightsPositions.push({x:j, y:i});
                  } else if(position?.type === 'p') {
                    this.whitePawnsPositions.push({x:j, y:i});
                  }
              } else {
                  this.countPieceMaterial(position?.type, this.blackCount);
                  if(position?.type === 'k') {
                    this.blackKingPosition = {x:j, y:i};
                  } else if (position?.type === 'q') {
                    this.blackQueensPositions.push({x:j, y:i});
                  } else if (position?.type === 'r') {
                    this.blackRooksPositions.push({x:j, y:i});
                  } else if (position?.type === 'b') {
                    this.blackBishopsPositions.push({x:j, y:i});
                  } else if (position?.type === 'n') {
                    this.blackKnightsPositions.push({x:j, y:i});
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

  public refreshPeacesPosition() {
    this.checkMaterial();
  }

  public getAllWhitePeacesPosition() {
    return this.whiteQueensPositions.concat(this.whiteRooksPositions, this.whiteBishopsPositions,
      this.whiteKnightsPositions, this.whitePawnsPositions);
  }

  public getAllBlackPeacesPosition() {
    return this.blackQueensPositions.concat(this.blackRooksPositions, this.blackBishopsPositions,
      this.blackKnightsPositions, this.blackPawnsPositions);
  }

  private clear() {
    this.whiteCount.clear();
    this.blackCount.clear();
    this.whiteKingPosition = {x:-1, y:-1};
    this.whitePawnsPositions = Array<any>();
    this.whiteQueensPositions = Array<any>();
    this.whiteRooksPositions = Array<any>();
    this.whiteBishopsPositions = Array<any>();
    this.whiteKnightsPositions = Array<any>();
    this.blackKingPosition = {x:-1, y:-1};
    this.blackPawnsPositions = Array<any>();
    this.blackQueensPositions = Array<any>();
    this.blackRooksPositions = Array<any>();
    this.blackBishopsPositions = Array<any>();
    this.blackKnightsPositions = Array<any>();
  }
}