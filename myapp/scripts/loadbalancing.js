
const servers = [
    {name: 'server1', connection: 0},
    {name: 'server2', connection: 0},
    {name: 'server3', connection: 0},
]

const requestTime = [50, 50, 50, 2000, 50, 50]

//returns the server with the fewest active connections (tie-break: lowest index).
function pickServer(servers) {
    if (!servers || servers.length === 0) return null;

    let availableServer = servers[0];
    for (const server of servers) {
        if (availableServer.connection > server.connection)
            availableServer = server;
    }
    return availableServer;
}

//that increments that server's connection count, waits durationMs (use setTimeout or a Promise delay —
// this simulates the request being "in flight"), then decrements the count when done.
function simulateRequest(server, durationMs) {
    console.log(`Using ${server.name} for ${durationMs}, current connection ${server.connection}`)
    server.connection++;

    return new Promise((resolve) => {
        setTimeout(() => {
            server.connection--;
            console.log(`${server.name} has been released, current connection ${server.connection}`)
            resolve();
        }, durationMs);
    })
}

async function simulate() {
    let promise = []

    for (const ms of requestTime) {
    const p = simulateRequest(pickServer(servers), ms);
    promise.push(p)
    }

    await Promise.all(promise)
    console.log(servers)
}

simulate().catch(console.error)