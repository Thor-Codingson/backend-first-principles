const { Worker } = require('bullmq');

const worker = new Worker('email', async (job) => {
  // job.name → 'send-verification'
  // job.data → { email, verificationCode }

  console.log(`Processing job ${job.id}: ${job.name}`);
  console.log(`Sending verification email to ${job.data.email}`);

  // Simulate slow email API call
  // await new Promise(resolve => setTimeout(resolve, 2000));
  throw new Error('Email provider is down');

  console.log(`Email sent to ${job.data.email} with code ${job.data.verificationCode}`);

  // If we throw here, BullMQ treats it as failure and retries
}, {
  connection: {
    host: 'localhost',
    port: 6379,
  }
});

worker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed:`, err.message);
});