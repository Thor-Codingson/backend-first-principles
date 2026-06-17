const { Queue } = require('bullmq');

// 1. Create a queue connected to Redis
//    'email' = queue name. Worker must use same name.
const emailQueue = new Queue('email', {
  connection: { host: 'localhost', port: 6379 }
});

// 2. Export a function that adds jobs
//    This is what auth.service.js calls
async function addEmailJob(data) {
  await emailQueue.add(
    'send-verification',  // job name (type of work)
    data,                 // payload: { email, verificationCode }
    {
      attempts: 3,                        // retry up to 3 times on failure
      backoff: { type: 'exponential', delay: 1000 }, // 1s → 2s → 4s
      removeOnComplete: true,             // clean up Redis after success
      removeOnFail: false,                // keep failed jobs for inspection
    }
  );
}

module.exports = { addEmailJob };