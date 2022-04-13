import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);
const accA = await stdlib.newTestAccount(startingBalance);
const accB = await stdlib.newTestAccount(startingBalance);

const ctcA = accA.contract(backend);
const ctcB = accB.contract(backend, ctcA.getInfo());

const HAND = ['Rock', 'Paper', 'Scissors'];
const OUTCOME = ['B wins', 'Draw', 'A wins'];
const Player = (Who) => ({
  getHand: () => {
    const hand = Math.floor(Math.random() * 3);
    console.log(`${Who} played ${HAND[hand]}`);
    return hand;
  },
  seeOutcome: (outcome) => {
    console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
  },
});

await Promise.all([
  ctcA.p.A({
    ...Player('A'),
  }),
  ctcB.p.B({
    ...Player('B'),
  }),
]);