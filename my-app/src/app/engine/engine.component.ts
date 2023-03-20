import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Chess, Move, Square } from 'chess.js';
import { Castel } from '../components/castel';
import { Center } from '../components/center';
import { Peaces } from '../components/peaces';
import { ScorePosition } from '../components/score-position';
import { MoveEvaluation } from './MoveEvaluation';
import {NgxChessBoardService, NgxChessBoardView} from 'ngx-chess-board';
import { OpenLine } from '../components/open-line';
import { LastRanks } from '../components/last-ranks';
import { PassedPawn } from '../components/passed-pawn';
import { LichessApi } from '../api/LichessApi';
import { RobotUser } from '../api/RobotUser';
import { Material } from '../components/material';
import { TestBot } from '../test/TestBot';
import { PawnsStructures } from '../components/pawns-structure';
import { HangingPeaces } from '../components/hanging-peaces';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
  styleUrls: ['./engine.component.scss'],
})
export class EngineComponent implements AfterViewInit {

  @ViewChild('board', {static: false}) 
  public board!: NgxChessBoardView;
  private chess = new Chess();
  private scoreList:ScorePosition [] = [];
  private minScoreList:ScorePosition [] = [];
  private readonly MAX_DEPTH = 200;
  private scoreMap = new Map<string, number>();
  private currentDepth = 1;
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

  public gameState = "";

  private SQUARES = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8", "a7", "b7", "c7", "d7", "e7", "f7", "g7",
    "h7", "a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6", "a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5", "a4",
    "b4", "c4", "d4", "e4", "f4", "g4", "h4", "a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3", "a2", "b2", "c2",
    "d2", "e2", "f2", "g2", "h2", "a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1",
];

  constructor(
    private cdRef:ChangeDetectorRef, 
    private ngxChessBoardService: NgxChessBoardService) { }

  ngAfterViewInit(): void {
    this.createScoreList();

    this.board.reset();
    // this.loadFEN("r3r1k1/p3nppp/8/5bN1/5P2/2p5/P3P1PP/3KRB1R w - - 0 21"); // <--- Do sprawdzenia  
    this.game();
    
    // this.startRandomGame();

    this.startBot();
    // this.testBot();
  }

  private createScoreList(): void {
    this.scoreList.push(new Center(this.chess));
    this.scoreList.push(new Peaces(this.chess));
    this.scoreList.push(new OpenLine(this.chess));
    this.scoreList.push(new LastRanks(this.chess));
    this.scoreList.push(new PassedPawn(this.chess));
    this.scoreList.push(new PawnsStructures(this.chess, this.material));
    this.scoreList.push(new HangingPeaces(this.chess, this.material, this.SQUARES));

    this.minScoreList.push(new OpenLine(this.chess));
    this.minScoreList.push(new LastRanks(this.chess));
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
    if(!this.chess.isGameOver()) {
      this.makeMove(this.bestMove);
    }
  }

  private game(remainingTime?: number):MoveEvaluation {
    var self = this;
    this.fen = this.chess.fen();
    if(this.chess.isGameOver()) {
      return new MoveEvaluation(this.chess.moves({verbose: true})[0]);
    }
    this.allMoves = this.getAllMoves();
    let bestScore = this.getInitialScore();
    
    let candidateMovesByMaterial: MoveEvaluation[] = [];
    this.currentDepth = 1;
    this.evaluationScore = this.material.score();
    this.allMoves.forEach(function(value: MoveEvaluation) {
      self.evaluate(value, remainingTime);
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

    this.cdRef.detectChanges();

    return this.bestMove;
  }

  private getInitialScore(): number {
    if(this.chess.turn() === "w") {
      return -1000000;
    }

    return 1000000;
  }

  private getAllMoves() {
    let allMoves:MoveEvaluation[] = [];
    this.chess.moves({verbose: true}).forEach((move) => {
      allMoves.push(new MoveEvaluation(move));
    })

    return allMoves;
  }

  private evaluate(value:MoveEvaluation, remainingTime?: number) {
    let score = this.scoreForMyMove(value.move, this.evaluationScore, true);
    this.chess.move(value.move);

    if(this.chess.isCheckmate()) {
      if(this.chess.turn() === "b") {
        score += 1000;
      } else {
        score -= 1000;
      }
    } else if(this.isGameDrawn()) {
      score = 0;
    } else {
      if(this.chess.isCheck()) {
        value.check = 0.1;
        if(this.chess.turn() === "b") {
          score += 0.1;
        } else {
          score -= 0.1;
        }
      } else {
        score += this.scoreAttackOnKingRing()*0.01;
      }

      if(remainingTime && remainingTime < 15000) {
        this.minScoreList.forEach((scorePosition) => {
          let s = scorePosition.score();
          value.scoreList.set(scorePosition.description(), s);
          score += s;
        })
      } else {
        this.material.refreshPeacesPosition();
        this.scoreList.forEach((scorePosition) => {
          let s = scorePosition.score();
          value.scoreList.set(scorePosition.description(), s);
          score += s;
        })

        score += this.castel.evaluateCastel(value);
        score += this.evaluateCapture(score, value.move);
      }
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
      if(this.chess.isCheckmate()) {
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
    if(this.chess.turn() === move.color[0]) {
      let chessEngineMove = this. getChessEngineMove(move.move);
      this.chess.move(chessEngineMove);
      this.refresh();
    }
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
    const robot = new RobotUser(this.lichessApi, this.getReply, this.botMove.bind(this), 
    this.updateGameState.bind(this));
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
    this.cdRef.detectChanges();
  }

  private botMove(moves: any, remainingTime?: number) {
    this.chess.reset();
    moves.forEach((move: any) => this.chess.move(move));
    let bestMove = this.game(remainingTime);
    return bestMove.move.from + bestMove.move.to + (bestMove.move.flags === "p" ? bestMove.move.piece : "");
  }

  private updateGameState(newGameState: string) {
    if(newGameState) {
      this.gameState = newGameState;}
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
    return this.chess.isDraw() || this.chess.isStalemate() || this.chess.isThreefoldRepetition();
  }

  public challenge(botId :string) {
    this.lichessApi.challenge(botId);
  }

  private testBot() {
    const testBot = new TestBot(this.chess.load.bind(this.chess), this.game.bind(this));
    testBot.test();
  }

  private scoreAttackOnKingRing() : number {
    let score = 0;
    let whiteKingRing = this.getKingRing(this.material.whiteKingPosition);
    let blackKingRing = this.getKingRing(this.material.blackKingPosition);

    blackKingRing.forEach((field) => {
      if(this.chess.isAttacked(field as Square, 'w')) {
        score++;
      }
    })

    whiteKingRing.forEach((field) => {
      if(this.chess.isAttacked(field as Square, 'b')) {
        score--;
      }
    })
    
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