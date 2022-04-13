import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';
const stdlib = loadStdlib();

const startingBalance = stdlib.parseCurrency(100);
const accA = await stdlib.newTestAccount(startingBalance);
const accB = await stdlib.newTestAccount(startingBalance);

const ctcA = accA.contract(backend);
const ctcB = accB.contract(backend, ctcA.getInfo());

await Promise.all([
    ctcA.p.A({
    
  }),
  ctcB.p.B({
    
  }),
]);