'reach 0.1';

const Player = {
    getHand: Fun([], UInt),
    seeOutcome: Fun([UInt], Null),
};

export const main = Reach.App(() => {
    const A = Participant('A', {
        ...Player,
    });
    const B = Participant('B', {
        ...Player,
    });
    init();

    A.only(() => {
        const handA = declassify(interact.getHand());
    });
    A.publish(handA);
    commit();

    B.only(() => {
        const handB = declassify(interact.getHand());
    });
    B.publish(handB);

    const outcome = (handA + (4 - handB)) % 3;
    commit();

    each([A, B], () => {
        interact.seeOutcome(outcome);
    });
});