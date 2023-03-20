export class Game {

  private api;
  private name;
  private replyChat;
  private getNextMove;
  private updateGameState;
  private gameId = "";
  private colour = "";
  
  /**
   * Initialise with interface to lichess.
   */
   constructor(api:any , name: string, replyChat: Function, getNextMove: Function, updateGameState: Function) {
    this.api = api;
    this.name = name;
    this.replyChat = replyChat;
    this.getNextMove = getNextMove;
    this.updateGameState = updateGameState;
  }

  start(gameId: string) {
    this.gameId = gameId;
    this.api.streamGame(gameId, (event: any) => this.handler(event));
  }

  handleChatLine(event: any) {
    if (event.username !== this.name) {
      const reply = this.replyChat(event);
      if (reply) {
        this.api.chat(this.gameId, event.room, reply);
      }
    }
  }

  handler(event: any) {
    switch (event.type) {
      case "chatLine":
        this.handleChatLine(event);
        break;
      case "gameFull":
        this.colour = this.playingAs(event);
        this.playNextMove(event.state.moves);
        break;
      case "gameState":
        this.updateGameState(event.status);
        this.playNextMove(event.moves, this.getRemainingTime(event));
        break;
      default:
        console.log("Unhandled game event : " + JSON.stringify(event));
    }
  }

  getRemainingTime(event: any) {
    if(this.colour === 'white') {
      return event.wtime;
    } else {
      return event.btime;
    }
  }

  playNextMove(previousMoves: string, remainingTime?: number) {
    const moves = (previousMoves === "") ? [] : previousMoves.split(" ");
    if (this.isTurn(this.colour, moves)) {
      const nextMove = this.getNextMove(moves, remainingTime);
      if (nextMove) {
        console.log(this.name + " as " + this.colour + " to move " + nextMove);
        this.api.makeMove(this.gameId, nextMove);
      }
    }
  }

  playingAs(event: any) {
    return (event.white.name === this.name) ? "white" : "black";
  }

  isTurn(colour: string, moves: any) {
    var parity = moves.length % 2;
    return (colour === "white") ? (parity === 0) : (parity === 1);
  }

}