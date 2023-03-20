import { Game } from "./Game";

export class RobotUser {

  private api;
  private replyChat;
  private getNextMove;
  private updateGameState;
  private account: any;
  
  /**
   * Initialise with access token to lichess and a player algorithm.
   */
   constructor(api: any, replyChat: Function, getNextMove: Function, updateGameState: Function) {
    this.api = api;
    this.replyChat = replyChat;
    this.getNextMove = getNextMove;
    this.updateGameState = updateGameState;
  }

  async start() {
    this.account = await this.api.accountInfo();
    console.log("Playing as " + this.account.data.username);
    this.api.streamEvents((event: any) => this.eventHandler(event));
    return this.account;
  }

  eventHandler(event: any) {
    this.updateGameState(event?.challenge?.status);
    switch (event.type) {
      case "challenge":
        this.handleChallenge(event.challenge);
        break;
      case "gameStart":
        this.handleGameStart(event.game.id);
        break;
      default:
        console.log("Unhandled event : " + JSON.stringify(event));
    }
  }

  handleGameStart(id: string) {
    const game = new Game(this.api, this.account.data.username, this.replyChat, this.getNextMove, 
      this.updateGameState);
    game.start(id);
  }

  async handleChallenge(challenge: any) {
    if(challenge.challenger.id === "marcinlebot")
      return;

      
    if (challenge.rated) {
      console.log("Declining rated challenge from " + challenge.challenger.id);
      const response = await this.api.declineChallenge(challenge.id);
      console.log("Declined", response.data || response);
    }
    else {
      console.log("Accepting unrated challenge from " + challenge.challenger.id);
      const response = await this.api.acceptChallenge(challenge.id);
      console.log("Accepted", response.data || response);
    }
  }

}