import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Chess, PieceType, Move, ChessInstance } from 'chess.js';
import { Castel } from '../components/castel';
import { Center } from '../components/center';
import { Peaces } from '../components/peaces';
import { ScorePosition } from '../components/score-position';
import { MoveEvaluation } from './MoveEvaluation';
// import { ChessboardModule } from 'ng2-chessboard'
import {NgxChessBoardService, NgxChessBoardView} from 'ngx-chess-board';
import { OpenLine } from '../components/open-line';
import { LastRanks } from '../components/last-ranks';
import { PassedPawn } from '../components/passed-pawn';
import { LichessApi } from '../api/LichessApi';
import { RobotUser } from '../api/RobotUser';
import { Material } from '../components/material';
import { TestBot } from '../test/TestBot';
import * as e from 'express';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class EngineComponent implements AfterViewInit {

  @ViewChild('board', {static: false}) 
  public board!: NgxChessBoardView;
  private chess = new Chess();
  private scoreList:ScorePosition [] = [];
  private currentTurn = "";
  private readonly MAX_DEPTH = 200;
  private scoreMap = new Map<string, number>();
  private currentDepth = 1;
  private scoreWithoutCapture = 0;
  private evaluationScore = 0;
  private castel = new Castel(this.chess);
  private material = new Material(this.chess);

  public fen = "";
  public pgn = "";
  public allMoves: MoveEvaluation[] = [];
  public candidates: MoveEvaluation[] = [];
  public bestMove:MoveEvaluation = new MoveEvaluation(this.chess.moves({verbose: true})[0]);

  public newMove = "";

  public isRandomGame = false;
  public isBotMode = false;
  public onlineBots :any;

  private lichessApi =  new LichessApi()

  private SQUARES = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7",
    "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4",
    "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2",
    "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
];

  constructor(private cdRef:ChangeDetectorRef, private ngxChessBoardService: NgxChessBoardService) { }

  ngAfterViewInit(): void {
    this.scoreList.push(new Center(this.chess));
    this.scoreList.push(new Peaces(this.chess));
    this.scoreList.push(new OpenLine(this.chess));
    this.scoreList.push(new LastRanks(this.chess));
    this.scoreList.push(new PassedPawn(this.chess));

    this.board.reset();
    // this.loadFEN("8/7p/P1bk4/8/8/2K3R1/6pr/8 b - - 9 54");
    this.game();
    
    // this.startRandomGame();

    this.startBot();
    // this.testBot();
  }

  public startRandomGame() {
    this.board.reset();
    this.chess.reset();
    setTimeout(() => {
      this.randomGame();
    }, 3000)
  }

  private randomGame() {
    this.isRandomGame = true;
    if(!this.chess.game_over()) {
      this.makeMove(this.bestMove);
      // setTimeout(() => {
      //   this.makeMove(this.bestMove);
      //   this.randomGame();
      // }, 100)
    }
  }

  private game():MoveEvaluation {
    var self = this;
    this.fen = this.chess.fen();
    this.currentTurn = this.chess.turn();
    if(this.chess.game_over()) {
      // this.bestMove = "#";
      return new MoveEvaluation(this.chess.moves({verbose: true})[0]);
      ;
    }
    this.allMoves = this.getAllMoves();
    let bestScore = 0;
    if(self.chess.turn() === "w") {
      bestScore = -1000000;
    } else {
      bestScore = 1000000;
    }
    let candidateMovesByMaterial: MoveEvaluation[] = [];
    this.currentDepth = 1;
    this.scoreWithoutCapture = this.material.score();
    this.evaluationScore = this.scoreWithoutCapture;
    this.allMoves.forEach(function(value: MoveEvaluation) {
      self.evaluate(value);
      if((self.chess.turn() === "w" && value.score > bestScore) 
      || (self.chess.turn() === "b" && value.score < bestScore)) {
          bestScore = value.score;
          candidateMovesByMaterial = [];
          candidateMovesByMaterial.push(value);
      } else if(value.score == bestScore) {
        candidateMovesByMaterial.push(value);
      }
    })

    this.candidates = candidateMovesByMaterial;
    this.bestMove = candidateMovesByMaterial[Math.floor(Math.random() * candidateMovesByMaterial.length)];

    return this.bestMove;
  }

  private getAllMoves() {
    let allMoves:MoveEvaluation[] = [];
    this.chess.moves({verbose: true}).forEach((move) => {
      allMoves.push(new MoveEvaluation(move));
    })

    return allMoves;
  }

  private evaluate(value:MoveEvaluation) {
    let score = this.scoreForMyMove(value.move, this.evaluationScore, true);
    this.chess.move(value.move);

    if(this.chess.in_checkmate()) {
      if(this.chess.turn() === "b") {
        score += 1000;
      } else {
        score -= 1000;
      }
    } else if(this.isGameDrawn()) {
      score = 0;
    } else {
      if(this.chess.in_check()) {
        value.check = 0.1;
        if(this.chess.turn() === "b") {
          score += 0.1;
        } else {
          score -= 0.1;
        }
      } else {
        // score += this.scoreAttackOnKingRing();
      }
  
      this.scoreList.forEach((scorePosition) => {
        let s = scorePosition.score();
        value.scoreList.set(scorePosition.description(), s);
        score += s;
      })
  
      score += this.castel.evaluateCastel(value);
      score += this.evaluateCapture(score, value.move);
    }

    value.score = Math.round(score * 100) / 100;

    this.chess.undo();

  }

  private evaluateCapture(currentScore: number, move: Move): number {
    let score = currentScore;
    if(move.captured) {
      if(this.chess.turn() === "b") {
        if(score >= 5) {
          score += 0.5;
        } else if(score >= 2) {
          if(move.piece != "p") {
            score += 0.5;
          } else {
            if(this.material.whiteCount.pawns > 2) {
              score += 0.5;
            } else {
              score -= 0.5;
            }
          }
        } else if(score <= -2) {
          if(move.piece == "p") {
            score += 0.5;
          } else {
            score -= 0.5;
          }
        }
      } else {
        if(score <= -5) {
          score -= 0.5;
        } else if(score <= -2) {
          if(move.piece != "p") {
            score -= 0.5;
          } else {
            if(this.material.blackCount.pawns > 2) {
              score -= 0.5;
            } else {
              score += 0.5;
            }
          }
        } else if(score >= 2) {
          if(move.piece == "p") {
            score -= 0.5;
          } else {
            score += 0.5;
          }
        }
      }
    }

    return score;
  }

  private scoreForOponentMove(move: Move, currentEvaluation: number) {
    let score = currentEvaluation;
    if(move.captured) {
      if(this.chess.turn() === "w") {
        score += this.material.evaluatePieceMaterial(move.captured);
      } else {
        score -= this.material.evaluatePieceMaterial(move.captured);
      }
    }

    if(move.promotion) {
      let scoreForPromotion = this.material.evaluatePieceMaterial(move.promotion) - 1;
      if(this.chess.turn() === "w") {
        score += scoreForPromotion;
      } else {
        score -= scoreForPromotion;
      }
    }

    let bestScore = score;
    if(this.currentDepth < this.MAX_DEPTH) {
      this.currentDepth++;

      this.chess.move(move);

      this.chess.moves({verbose: true}).forEach((value: Move) => {
        if(value.captured && value.to === move.to) {
          let moveScore = this.scoreForMyMove(value, score, false);
          if(moveScore > bestScore && this.chess.turn() === "w") {
            bestScore = moveScore;
          } else if(moveScore < bestScore && this.chess.turn() === "b") {
            bestScore = moveScore;
          }
        }
      })
      
      this.chess.undo();

      this.currentDepth--;
    }
    
    this.scoreMap.set(this.chess.fen(), bestScore);
    return bestScore;
  }

  private scoreForMyMove(move: Move, currentEvaluation: number, isFirstMoveOfEvaluation: boolean) {
    let score = currentEvaluation;
    if(move.captured) {
      if(this.chess.turn() === "w") {
        score += this.material.evaluatePieceMaterial(move.captured);
      } else {
        score -= this.material.evaluatePieceMaterial(move.captured);
      }
    }

    if(move.promotion) {
      let scoreForPromotion = this.material.evaluatePieceMaterial(move.promotion) - 1;
      if(this.chess.turn() === "w") {
        score += scoreForPromotion;
      } else {
        score -= scoreForPromotion;
      }
    }

    let worstScore = score;
    this.chess.move(move);

    this.chess.moves({verbose: true}).forEach((value: Move) => {
      if(this.isOponentNextMoveCheckmate(value)) {
        if(this.chess.turn() === "b") {
          worstScore = -1000;
        } else {
          worstScore = 1000;
        }
      } else {
        if(value.promotion || (value.captured && (isFirstMoveOfEvaluation || value.to === move.to))) {
          let moveScore = this.scoreForOponentMove(value, score);
          if(moveScore < worstScore && this.chess.turn() === "b") {
            worstScore = moveScore;
          } else if(moveScore > worstScore && this.chess.turn() === "w") {
            worstScore = moveScore;
          }
        }
      }
    })
    
    this.chess.undo();

    this.scoreMap.set(this.chess.fen(), worstScore);
    return worstScore;
  }

  private isOponentNextMoveCheckmate(move: Move) {
    this.chess.move(move);
      if(this.chess.in_checkmate()) {
        this.chess.undo();
        return true;
      }
      this.chess.undo();
      return false;
  }

  public makeMove(newMove: MoveEvaluation) {
    this.chess.move(newMove.move);
    
    let boardMove = this.getBoardMove(newMove);
    this.board.move(boardMove);

    this.refresh();
  }

  private getBoardMove(newMove: MoveEvaluation): string {
    let boardMove = newMove.move.from + newMove.move.to;

    if(newMove.move.promotion) {
      let promotion = newMove.move.promotion;
      switch(promotion) {
        case "q":
          boardMove += "1";
          break;
        case "r":
          boardMove += "2";
          break;
        case "b":
          boardMove += "3";
          break;
        case "n":
          boardMove += "4";
          break;
      }
    }

    return boardMove;
  }

  public moveBack() {
    this.chess.undo();
    this.board.undo();
    this.refresh();
  }

  private refresh() {
    setTimeout(() => {
      this.game();
      this.pgn = this.chess.pgn();
      if(this.isGameDrawn()) {
        this.pgn += " 1/2"
      }
      this.newMove = "";

      if(this.isRandomGame) {
        this.randomGame();
      }
    }, 500)
  }

  public copyPgn() {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData?.setData('text/plain', (this.pgn));
      e.preventDefault();
      // document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  public moveCallback(move:any) {
    let chessEngineMove = this. getChessEngineMove(move.move);
    this.chess.move(chessEngineMove, { sloppy: true });
    this.refresh();
  }

  private getChessEngineMove(move: string): string {
    let chessEngineMove = move.substring(0,4);

    if(move.length === 5) {
      switch(move[4]) {
        case '1':
          chessEngineMove += 'q';
          break;
        case '2':
          chessEngineMove += 'r';
          break;
        case '3':
          chessEngineMove += 'b';
          break;
        case '4':
          chessEngineMove += 'n';
          break;
      }
    }

    return chessEngineMove;
  }

  private loadFEN(fen: string) {
    this.chess.load(fen);
    this.board.setFEN(fen);
  }

  private startBot() {
    this.isBotMode = true;
    const robot = new RobotUser(this.lichessApi, this.getReply, this.botMove.bind(this));
    robot.start();

    this.lichessApi.getOnlineBots().then((bots) => {
      this.onlineBots = bots.data.trim().split("\n").map(JSON.parse);
      this.onlineBots.sort((a: any, b: any) => {
        if(a.perfs.bullet.rating > b.perfs.bullet.rating) {
          return 1;
        }
        return -1;
      })
    });
  }

  private botMove(moves: any) {
    this.chess.reset();
    moves.forEach((move: any) => this.chess.move(move, { sloppy: true }));
    let bestMove = this.game();
    return bestMove.move.from + bestMove.move.to + (bestMove.move.flags === "p" ? bestMove.move.piece : "");
  }

  private getReply() {
    return "hi";
  }

  public stopRandomGame() {
    this.isRandomGame = false;
  }

  public resumeRandomGame() {
    this.isRandomGame = true;
    this.refresh();
  }

  private isGameDrawn() {
    return this.chess.in_draw() || this.chess.in_stalemate() || this.chess.in_threefold_repetition();
  }

  public challenge(botId :string) {
    this.lichessApi.challenge(botId);
  }

  private testBot() {
    const testBot = new TestBot(this.chess.load, this.game.bind(this));
    testBot.test();
  }

  private scoreAttackOnKingRing() : number {
    let score = 0;
    let whiteKingRing = this.getKingRing(this.material.whiteKingPosition);
    let blackKingRing = this.getKingRing(this.material.blackKingPosition);

    // if(this.chess.turn() == "w") {
    //   this.chess.moves().forEach((move) => {
    //     let found = whiteKingRing.find((obj) => {
    //       return obj === move;
    //     })

    //     if(found) {
    //       score++;
    //     }
    //   })
    // }
    
    return score;
  }

  private getKingRing(kingPosition: any) {
    let kingRing = [];

    let whiteKingX = kingPosition.x;
    let whiteKingY = kingPosition.y;

    for(let x=whiteKingX-1; x<=whiteKingX+1; x++) {
      if(x<0 || x>7) {
        continue;
      }
      for(let y=whiteKingY-1; y<=whiteKingY+1; y++) {
        if(y<0 || y>7) {
          continue;
        }

        kingRing.push(this.SQUARES[y*8+x]);
      }
    }

    return kingRing;
  }

}