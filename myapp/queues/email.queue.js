const { Queue } = require('bullmq');

const emailQueue = new Queue('email', {
  connection: {
    host: 'localhost',
    port: 6379,
  }
});

async function addEmailJob(data) {
  await emailQueue.add('send-verification', data, {
    attempts: 3,               // retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 1000,             // start at 1s, then 2s, then 4s
    },
    removeOnComplete: true,    // ← clean up after success
   removeOnFail: false,       // ← keep failed jobs for inspection
  });
}

module.exports = { addEmailJob };