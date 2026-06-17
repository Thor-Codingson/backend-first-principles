const { Worker } = require('bullmq');

// 1. Connect to same 'email' queue in Redis
//    Handler runs automatically when a job arrives
const worker = new Worker('email', async (job) => {

  // 2. job.name → which type of job is this?
  //    job.data → the payload from addEmailJob()
  console.log(`Processing job ${job.id}: ${job.name}`);
  console.log(`Sending email to ${job.data.email}`);

  // Simulate slow email API (2 seconds)
  await new Promise(resolve => setTimeout(resolve, 2000));

  // If we throw here → BullMQ treats as failure → retries
  console.log(`Email sent to ${job.data.email}`);

}, {
  connection: { host: 'localhost', port: 6379 }
});

// 3. Event listeners — for logging/monitoring
worker.on('completed', (job) => console.log(`Job ${job.id} completed`));
worker.on('failed', (job, err) => console.log(`Job ${job.id} failed:`, err.message));