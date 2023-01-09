// import {EngineComponent} from './engine.component';
const EngineComponent = require('./engine.component.ts');
{/* <script type="module" src="./engine.component.ts"></script> */}


test('adds 1 + 2 to equal 3', () => {
    expect(1+ 2).toBe(3);
  });

  test('chess engine', () => {
    var engine = new EngineComponent();
  });