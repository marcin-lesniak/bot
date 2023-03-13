import { TestCase } from "./TestCase";

export class TestBot {

    private verbose = false;
  
   constructor(private loadFen: Function, private getNextMove: Function) {
  }

  public test() {
    console.log("TEST START");
    let passed = 0;
    let failed = 0;
    this.loadTests().forEach((testCase:TestCase) => {
        this.loadFen(testCase.fen);
        let bestMove = this.getNextMove();
        let bestMoveStr = `${bestMove.move.from}${bestMove.move.to}`;
        if(this.verbose) {
            console.log("TEST - " + testCase.decription);
            console.log(`${bestMoveStr} | ${testCase.bestMove}`);
        } else if(`${bestMoveStr}` !== `${testCase.bestMove}`) {
            console.warn(`${testCase.decription} | ${bestMoveStr} | ${testCase.bestMove}`);
            failed++;
        } else {
            passed++;
        }
        
    });
    console.log(`Total:${passed + failed} | Passed:${passed} | Faild:${failed}`);
    console.log("TEST END");
  }

  private loadTests(): TestCase[] {
    let testCases: TestCase[] = [];
    testCases.push(...this.center());
    testCases.push(...this.peaces());
    testCases.push(...this.castle());
    testCases.push(...this.openLine());
    testCases.push(...this.lastRank());
    testCases.push(...this.passedPawn());
    testCases.push(...this.exchange());
    testCases.push(...this.twoBishops());
    testCases.push(...this.promotion());
    testCases.push(...this.kingRing());
    testCases.push(...this.doubledPawns());
    testCases.push(...this.hangingPeaces());
    return testCases;
  }

  private center() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "Center - c4",
        "rnbqkbnr/pppppppp/8/8/3PPP2/5N2/PPPNB1PP/R1BQ1RK1 w Qkq - 0 1",
        "c2c4"
    ));
    testCases.push(new TestCase(
        "Center - d4",
        "rnbqkbnr/pppppppp/8/8/2P1PP2/2N2N2/PPQPB1PP/R1B2RK1 w Qkq - 0 1",
        "d2d4"
    ));
    testCases.push(new TestCase(
        "Center - e4",
        "rnbqkbnr/pppppppp/8/8/2PP1P2/1QNB1N2/PP1BP1PP/R4RK1 w Qkq - 0 1",
        "e2e4"
    ));
    testCases.push(new TestCase(
        "Center - f4",
        "rnbqkbnr/pppppppp/8/8/2PPP3/1QNB4/PP1BNPPP/R4RK1 w Qkq - 0 1",
        "f2f4"
    ));
    testCases.push(new TestCase(
        "Center - c5",
        "r1bq1rk1/pppnb1pp/5n2/3ppp2/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "c7c5"
    ));
    testCases.push(new TestCase(
        "Center - d5",
        "r1b2rk1/ppqpb1pp/n4n2/2p1pp2/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "d7d5"
    ));
    testCases.push(new TestCase(
        "Center - e5",
        "r4rk1/ppqbp1pp/n2b1n2/2pp1p2/8/6P1/PPPPPP1P/RNBQKBNR b KQq - 0 1",
        "e7e5"
    ));
    testCases.push(new TestCase(
        "Center - f5",
        "r4rk1/ppqbnppp/n2b4/2ppp3/8/6P1/PPPPPP1P/RNBQKBNR b KQq - 0 1",
        "f7f5"
    ));

    return testCases;
  }

  private peaces() {
    let testCases: TestCase[] = [];
    testCases.push(new TestCase(
        "Peaces - Nb1",
        "rnbqkbnr/pppppppp/8/8/2PPPP2/P4N2/1PQBB1PP/RN3RK1 w Qkq - 0 1",
        "b1c3"
    ));
    testCases.push(new TestCase(
        "Peaces - Ng1",
        "rnbqkbnr/pppppppp/8/8/2PPPP2/P1N4P/1PQBB1P1/2KR2NR w Kkq - 0 1",
        "g1f3"
    ));
    testCases.push(new TestCase(
        "Peaces - Bc1",
        "rnbqkbnr/pppppppp/8/8/2PPPP2/P1NBN3/1PQ3PP/R1B2RK1 w Qkq - 0 1",
        "c1d2"
    ));
    testCases.push(new TestCase(
        "Peaces - Bf1",
        "rnbqkbnr/pppppppp/8/8/2PPPP2/P1NQ1N1P/1P1B2P1/2KR1B1R w Kkq - 0 1",
        "f1e2"
    ));
    testCases.push(new TestCase(
        "Peaces - Qd1",
        "rnbqkbnr/pppppppp/8/8/2PPPP2/PPN2N1P/3BB1P1/R2Q1RK1 w kq - 0 1",
        "d1c2"
    ));
    testCases.push(new TestCase(
        "Peaces - Nb8",
        "rn3rk1/1pqbb1pp/p4n2/2pppp2/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "b8c6"
    ));
    testCases.push(new TestCase(
        "Peaces - Ng8",
        "2kr2nr/1pqbb1p1/p1n4p/2pppp2/8/8/PPPPPPPP/RNBQKBNR b KQk - 0 1",
        "g8f6"
    ));
    testCases.push(new TestCase(
        "Peaces - Bc8",
        "r1b2rk1/pp2qppp/3bnn2/2ppp3/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "c8d7"
    ));
    testCases.push(new TestCase(
        "Peaces - Bf8",
        "2kr1b1r/ppqn1ppp/3p1n2/2pbp3/8/8/PPPPPPPP/RNBQKBNR b KQk - 0 1",
        "f8e7"
    ));
    testCases.push(new TestCase(
        "Peaces - Qd8",
        "r2q1rk1/p2bbppp/1pn2n2/2ppp3/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "d8c7"
    ));
    return testCases;
  }

  private castle() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "Castel white - 0-0",
        "rnbqkbnr/pppppppp/8/8/3PP3/2N2NP1/PPPBQPBP/1R2K2R w Kkq - 0 1",
        "e1g1"
    ));
    testCases.push(new TestCase(
        "Castel white - 0-0-0",
        "rnbqkbnr/pppppppp/8/8/3PP3/2N2NP1/PPPBQPBP/R3K1R1 w Qkq - 0 1",
        "e1c1"
    ));
    testCases.push(new TestCase(
        "Castel black - 0-0",
        "1r2k2r/pppq1ppp/2n2n2/2bppb2/8/8/PPPPPPPP/RNBQKBNR b KQk - 0 1",
        "e8g8"
    ));
    testCases.push(new TestCase(
        "Castel black - 0-0-0",
        "r3k1r1/pppq1ppp/2n2n2/2bppb2/8/8/PPPPPPPP/RNBQKBNR b KQq - 0 1",
        "e8c8"
    ));
    
    return testCases;
  }

  private openLine() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "Semi-open line - white",
        "rn2k2r/pppbbppp/4pn2/8/8/2NB1N2/PPPP1PPP/R1B2RK1 w Qkq - 0 1",
        "f1e1"
    ));

    testCases.push(new TestCase(
        "Semi-open line - black",
        "rn3rk1/1p1b1ppp/p1p1pn2/2b5/8/2NB1N2/PPPP1PPP/R1B2RK1 b Qq - 0 1",
        "f8d8"
    ));

    testCases.push(new TestCase(
        "open line vs semi-open - white",
        "rn2k2r/pp1bbppp/4pn2/8/8/N2B1N2/PP1P1PPP/5RK1 w kq - 0 1",
        "f1c1"
    ));

    testCases.push(new TestCase(
        "open line vs semi-open - black",
        "rn3rk1/1p1nb2p/p1b3p1/4pp2/8/N2B1N2/PP1P1PPP/5RK1 b q - 0 1",
        "f8c8"
    ));
    
    return testCases;
  }

  private lastRank() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "7th rank",
        "4rk2/5ppp/8/8/8/8/4PPP1/2R2K2 w - - 0 1",
        "c1c7"
    ));

    testCases.push(new TestCase(
        "8th rank, no checkmate",
        "5k2/r4ppp/8/8/8/8/4PPP1/2R2K2 w - - 0 1",
        "c1c8"
    ));

    testCases.push(new TestCase(
        "8th rank with checkmate",
        "6k1/r4ppp/8/8/8/8/4PPP1/2R2K2 w - - 0 1",
        "c1c8"
    ));

    testCases.push(new TestCase(
        "2nd rank",
        "5k2/r4ppp/8/8/8/8/4PPP1/2R2K2 b - - 0 1",
        "a7a2"
    ));

    testCases.push(new TestCase(
        "1st rank, no checkmate",
        "5k2/r4ppp/8/8/8/8/2R1PP2/5K2 b - - 0 1",
        "a7a1"
    ));

    testCases.push(new TestCase(
        "1st rank with checkmate",
        "5k2/r4ppp/8/8/8/8/2R1PPP1/5K2 b - - 0 1",
        "a7a1"
    ));
    
    return testCases;
  }

  private passedPawn() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "passed pawn white",
        "5k2/5ppp/1P6/8/8/3K1P2/P7/8 w - - 0 1",
        "b6b7"
    ));

    testCases.push(new TestCase(
        "passed pawn black",
        "5k2/6pp/1P6/5p2/8/3K1P2/P7/8 b - - 0 1",
        "h7h5"
    ));

    testCases.push(new TestCase(
        "push passed pawn is better than center - white",
        "8/8/8/8/4P3/8/8/k6K w - - 0 1",
        "e4e5"
    ));

    testCases.push(new TestCase(
        "push passed pawn is better than center - black",
        "1RK5/p3b3/k6p/2p4P/1p6/8/4r3/8 b - - 1 62",
        "c5c4"
    ));

    testCases.push(new TestCase(
        "push passed pawn is better then promotion if new peaces can be captured",
        "8/7p/P1bk4/8/8/2K3R1/6pr/8 b - - 9 54",
        "h7h5"
    ));
    
    return testCases;
  }

  private exchange() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "exchange peace when material is in plus",
        "8/4pp2/1p2nk2/3B4/2P2P2/6P1/PP3K2/8 w - - 0 1",
        "d5e6"
    ));

    testCases.push(new TestCase(
        "exhange pawns when have advantage and more pawns then 2",
        "8/p1p1p1p1/1p2nk2/2P5/5P2/4P1P1/P2PBK1P/8 w - - 0 1",
        "c5b6"
    ));

    testCases.push(new TestCase(
        "don't exhange pawns when have advantage and less pawns then 2",
        "8/p7/1p5k/2P5/8/8/4BK2/8 w - - 0 1",
        "c5c6"
    ));

    testCases.push(new TestCase(
        "exhange pawns when opponent has advantage",
        "8/p1p1pp2/1p3kn1/2P5/3P1P2/4P1P1/PP2BK2/8 b - - 0 1",
        "b6c5"
    ));

    testCases.push(new TestCase(
        "don't exhange peaces when opponeny has advantage",
        "8/p1p1p3/1p2k1n1/2P5/3P1P1B/6P1/PP3K2/8 b - - 0 1",
        "b6c5"
    ));
    
    return testCases;
  }

  private twoBishops() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "exchange knight for bishop to have bishop pair",
        "8/p1pbp1b1/1p2k1n1/8/2P2P1B/1P1P2P1/P1BN1K2/8 b - - 0 1",
        "g6h4"
    ));

    testCases.push(new TestCase(
        "if have bishop pair don't exhange bishop for knight",
        "8/p1pbpkb1/1p3n2/8/2P2P1B/1N4P1/PPBP1K2/8 w - - 0 1",
        "d2d4"
    ));
    
    return testCases;
  }

  private promotion() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "promotion for white",
        "2R5/p3P3/kp5p/2p4P/8/P6K/2rb4/8 w - - 3 49",
        "e7e8"
    ));

    testCases.push(new TestCase(
        "promotion for black",
        "8/p5K1/7p/2p3bP/k7/8/1p6/8 b - - 1 72",
        "b2b1"
    ));
    
    return testCases;
  }

  private kingRing() {
    let testCases: TestCase[] = [];

    testCases.push(new TestCase(
        "king ring for white",
        "rnbq1rk1/ppp1bpp1/4pn1p/3p4/3P4/1P2PN2/PBP2PPP/RNQ1RBK1 w Qq - 0 1",
        "f1d3"
    ));

    testCases.push(new TestCase(
        "king ring for black",
        "1n1q1rk1/1p1b2pp/p1pnp3/3p1p2/3P4/1P1BP3/PBPN1PPP/RN1Q1RK1 b Q - 0 1",
        "d8h4"
    ));

    return testCases;
  }

    private doubledPawns() {
        let testCases: TestCase[] = [];
    
        testCases.push(new TestCase(
            "recapture for white",
            "rn1qkbnr/ppp1pp1p/3p2p1/8/2PP4/4Pb2/PP2QPPP/RNB1KB1R w KQkq - 0 1",
            "e2f3"
        ));
    
        testCases.push(new TestCase(
            "recapture for black",
            "rnb1kb1r/ppp1qppp/4pB2/3p4/3P4/4PN2/PPP2PPP/RN1QKB1R b KQkq - 0 1",
            "e7f6"
        ));
    
    return testCases;
  }

  private hangingPeaces() {
    let testCases: TestCase[] = [];
    
    //TODO
    // testCases.push(new TestCase(
    //     "attack hanging peace - white",
    //     "r4rk1/1p1nb2p/p5p1/4pp2/8/N4N2/PP3PPP/5RK1 w - - 0 1",
    //     "f1d1"
    // ));

    testCases.push(new TestCase(
        "move hanging peace - white",
        "kr3r2/1p1n3p/p5p1/4pp2/8/NP3N2/P4PPP/6K1 w - - 0 1",
        "a3c4"
    ));

    testCases.push(new TestCase(
        "defece hanging peace - white",
        "r4r1k/1p1n1p1p/p5p1/3N4/8/1P3N2/P1P1PPPP/6K1 w - - 0 1",
        "c2c4"
    ));

    //TODO
    // testCases.push(new TestCase(
    //     "attack hanging peace - black",
    //     "5rk1/1p2b2p/pn4p1/5p2/3N4/2N5/PP3PPP/5RK1 b - - 0 1",
    //     "f8d8"
    // ));

    testCases.push(new TestCase(
        "move hanging peace - black",
        "6k1/1p1pp2p/p5p1/5p2/6n1/NP6/P3NPPP/6K1 b - - 0 1",
        "e7e5"
    ));

    testCases.push(new TestCase(
        "defece hanging peace - black",
        "r2k1r2/1p1np3/pPp3p1/P1P2p1p/2NP4/5N2/4PPPP/6K1 b - - 0 1",
        "a8b8"
    ));

    return testCases;
  }

}