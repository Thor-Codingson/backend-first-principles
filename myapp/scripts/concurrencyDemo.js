let inviteCount = 9;
const MAX_INVITES = 10;
const ms = 1000

let lock = Promise.resolve();
// One hint: the simplest working in-process async lock in JS is a single let lock = Promise.resolve()
// that you chain onto — each caller does lock = lock.then(() => criticalSection()).
function withLock(fn) {
  // chain onto the shared lock, run fn, and make sure
  // the NEXT caller waits for fn to finish — not just for
  // your position in the chain to be reached
  const nextLock = lock.then(() => fn());
  lock = nextLock.catch(() => {});
  return nextLock;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
    console.log(`inviteCount: ${inviteCount}`)
    resolve();
    }, ms);
  });
}

// use withLock to wrap the check-then-act
async function requestInvite(ms) {
    return withLock( async() => {
        if (inviteCount < MAX_INVITES) {
            await wait(ms);
            inviteCount++;
    }
  });
}

async function simulate() {
    const promises = []

    for (let i = 0; i < 5; i++) {
        const p = requestInvite(i*100);
        promises.push(p)
    }

    await Promise.all(promises)
    console.log('Final:', inviteCount)
}

simulate().catch(console.error);