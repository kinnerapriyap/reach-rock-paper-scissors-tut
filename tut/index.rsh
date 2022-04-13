'reach 0.1';

const [isHand, ROCK, PAPER, SCISSORS] = makeEnum(3);
const [isOutcome, B_WINS, DRAW, A_WINS] = makeEnum(3);

const winner = (handA, handB) =>
    ((handA + (4 - handB)) % 3);

assert(winner(ROCK, PAPER) == B_WINS);
assert(winner(PAPER, ROCK) == A_WINS);
assert(winner(ROCK, ROCK) == DRAW);

forall(UInt, handA =>
    forall(UInt, handB =>
        assert(isOutcome(winner(handA, handB)))));

forall(UInt, (hand) =>
    assert(winner(hand, hand) == DRAW));

const Player = {
    ...hasRandom,
    getHand: Fun([], UInt),
    seeOutcome: Fun([UInt], Null),
    informTimeout: Fun([], Null),
};

export const main = Reach.App(() => {
    const A = Participant('A', {
        ...Player,
        wager: UInt,
        deadline: UInt,
    });
    const B = Participant('B', {
        ...Player,
        acceptWager: Fun([UInt], Null),
    });
    init();

    const informTimeout = () => {
        each([A, B], () => {
            interact.informTimeout();
        });
    };

    A.only(() => {
        const wager = declassify(interact.wager);
        const _handA = interact.getHand();
        const [_commitA, _saltA] = makeCommitment(interact, _handA);
        const commitA = declassify(_commitA);
        const deadline = declassify(interact.deadline);
    });
    A.publish(wager, commitA, deadline)
        .pay(wager);
    commit();

    unknowable(B, A(_handA, _saltA));
    B.only(() => {
        interact.acceptWager(wager);
        const handB = declassify(interact.getHand());
    });
    B.publish(handB)
        .pay(wager)
        .timeout(relativeTime(deadline), () => closeTo(A, informTimeout));
    commit();

    A.only(() => {
        const saltA = declassify(_saltA);
        const handA = declassify(_handA);
    });
    A.publish(saltA, handA)
        .timeout(relativeTime(deadline), () => closeTo(B, informTimeout));

    checkCommitment(commitA, saltA, handA);

    const outcome = (handA + (4 - handB)) % 3;
    const [forA, forB] =
        outcome == A_WINS ? [2, 0] :
            outcome == B_WINS ? [0, 2] :
    /* tie      */[1, 1];
    transfer(forA * wager).to(A);
    transfer(forB * wager).to(B);
    commit();

    each([A, B], () => {
        interact.seeOutcome(outcome);
    });
});