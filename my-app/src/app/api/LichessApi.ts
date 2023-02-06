// const axios = require("axios");
// const oboe = require("oboe");

import axios from "axios";
import * as oboe from "oboe";

export class LichessApi {
  
  private token = "lip_U2PnD9AVg0rt8zcIsjYk"  ;
  private baseURL = "http://localhost:4200/";
  // private baseURL = "https://marcin-lesniak.github.io/bot/";
  private headers = { "Authorization": `Bearer ${this.token}` };
  private axiosConfig = {
    baseURL: this.baseURL,
    headers: this.headers
  };

  constructor() {}

  public getOnlineBots() {
    return this.get("api/bot/online")
  }

  public acceptChallenge(challengeId: string) {
    return this.post(`api/challenge/${challengeId}/accept`);
  }

  declineChallenge(challengeId: string) {
    return this.post(`api/challenge/${challengeId}/decline`);
  }

  upgrade() {
    return this.post("api/bot/account/upgrade");
  }

  accountInfo() {
    return this.get("api/account");
  }

  makeMove(gameId: string, move: string) {
    return this.post(`api/bot/game/${gameId}/move/${move}`);
  }

  abortGame(gameId: string) {
    return this.post(`api/bot/game/${gameId}/abort`);
  }

  resignGame(gameId: string) {
    return this.post(`api/bot/game/${gameId}/resign`);
  }

  streamEvents(handler: any) {
    return this.stream("api/stream/event", handler);
  }

  streamGame(gameId: string, handler: any) {
    return this.stream(`api/bot/game/stream/${gameId}`, handler);
  }

  chat(gameId: string, room: string, text: string) {
    return this.post(`api/bot/game/${gameId}/chat`, {
      room,
      text
    });
  }

  logAndReturn(data: any) {
    console.log(JSON.stringify(data.data));
    return data;
  }

  challenge(botId: string) {
    return this.post(`api/challenge/${botId}`, {
      rated: true,
      clock: {
        limit: 60,
        increment: 1
      },
      variant: "standard",
      keepAliveStream: "false"
    })
  }

  get(URL: string) {
    console.log(`GET ${URL}`);
    return axios.get(URL + "?v=" + Date.now(), this.axiosConfig)
      .then(this.logAndReturn)
      .catch((err: any) => console.log(err));
  }

  post(URL: string, body?: any) {
    console.log(`POST ${URL} ` + JSON.stringify(body || {}));
    return axios.post(URL, body || {}, this.axiosConfig)
      .then(this.logAndReturn)
      .catch((err: any) => console.log(err.response || err));
  }

  /**
   * Connect to stream with handler.
   * 
   * The axios library does not support streams in the browser so use oboe.
   */
  stream(URL: string, handler: any) {
    console.log(`GET ${URL} stream`);
    oboe({
        method: "GET",
        url: this.baseURL + URL,
        headers: this.headers,
      })
      .node("!", function(data: any) {
        console.log("STREAM data : " + JSON.stringify(data));
        handler(data);
      }).fail(function(errorReport: any) {
        console.error(JSON.stringify(errorReport));
      });
  }

}