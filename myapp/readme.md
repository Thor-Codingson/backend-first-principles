## Performance Benchmark

Tool: autocannon (`-c 100 -d 20`), endpoint: `GET /api/v1/books` (no auth)

| Config                          | p50  | p97.5 | p99  | Avg latency | Max   | Avg req/sec |
|----------------------------------|------|-------|------|-------------|-------|-------------|
| Before (default pool, no gzip)   | 7ms  | 16ms  | 20ms | 8.17ms      | 90ms  | 11,586      |
| + Pool tuning only                | 7ms  | 10ms  | 13ms | 7.49ms      | 75ms  | 12,556      |
| + Pool tuning + compression       | 7ms  | 10ms  | 12ms | 7.52ms      | 80ms  | 12,557      |

**Findings:**
- Pool tuning (`max:10, min:2, idleTimeoutMillis:30000, connectionTimeoutMillis:5000`) was the primary driver: p99 dropped 20ms→13ms (~35%), throughput up ~8.4%. Isolated via before/after with compression held constant.
- Compression (`app.use(compression())`) showed negligible effect locally (12,556 vs 12,557 req/sec) — expected, since localhost has near-zero network transfer time, and compression's benefit is reducing bytes-over-the-wire. Would need a real-network or bandwidth-throttled benchmark to show its actual impact.
- Note: `min` in `pg` Pool does not pre-warm connections at startup — it only prevents eviction below that count once organically opened.