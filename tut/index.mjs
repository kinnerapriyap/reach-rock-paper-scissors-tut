import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);
const accA = await stdlib.newTestAccount(startingBalance);
const accB = await stdlib.newTestAccount(startingBalance);

const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
const beforeA = await getBalance(accA);
const beforeB = await getBalance(accB);

const ctcA = accA.contract(backend);
const ctcB = accB.contract(backend, ctcA.getInfo());

const HAND = ['Rock', 'Paper', 'Scissors'];
const OUTCOME = ['B wins', 'Draw', 'A wins'];
const Player = (Who) => ({
  ...stdlib.hasRandom,
  getHand: async () => { // <-- async now
    const hand = Math.floor(Math.random() * 3);
    console.log(`${Who} played ${HAND[hand]}`);
    if (Math.random() <= 0.01) {
      for (let i = 0; i < 10; i++) {
        console.log(`  ${Who} takes their sweet time sending it back...`);
        await stdlib.wait(1);
      }
    }
    return hand;
  },
  seeOutcome: (outcome) => {
    console.log(`${Who} saw outcome ${OUTCOME[outcome]}`);
  },
  informTimeout: () => {
    console.log(`${Who} observed a timeout`);
  },
});

await Promise.all([
  ctcA.p.A({
    ...Player('A'),
    wager: stdlib.parseCurrency(5),
    deadline: 10,
  }),
  ctcB.p.B({
    ...Player('B'),
    acceptWager: (amt) => {
      console.log(`B accepts the wager of ${fmt(amt)}.`);
    },
  }),
]);

const afterA = await getBalance(accA);
const afterB = await getBalance(accB);

console.log(`A went from ${beforeA} to ${afterA}.`);
console.log(`B went from ${beforeB} to ${afterB}.`);