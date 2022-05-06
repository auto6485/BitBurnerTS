import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    //split single argument into multiple and instantiate arrays
    const myargs = ns.args[0].split(',');
    const servers = [];
    const minSecLevs = [];
    const maxMoneys = [];
    const reqHackLev = [];
    let counter = 0;

    //for each pair of 4 (1 server and its parameters)
    for (let i = 0; (myargs.length / 4) > i; i++) {
        //calculate and push to appropriate array
        servers.push(myargs[4 * i]);
        minSecLevs.push(Number(myargs[(3 * counter) + (i + 1)]));
        maxMoneys.push(Number(myargs[(3 * counter) + (i + 2)]));
        reqHackLev.push(Number(myargs[(3 * counter) + (i + 3)]));
        counter++;
    }

    while (true) {
        let count = 0;
        //begin hack analyze
        for (const server of servers) {
            const security = minSecLevs[count] + 5;
            const money = maxMoneys[count] * .75;
            //weaken if server is too strong
            ns.print(security);
            if (reqHackLev[count] <= ns.getHackingLevel()) {
                if (ns.getServerSecurityLevel(server) > security) {
                    ns.print("weakening...");
                    await ns.weaken(server)
                }
                //grow money if not enough money
                else if (ns.getServerMoneyAvailable(server) < money) {
                    ns.print("growing...");
                    await ns.grow(server);
                }
                else {
                    //hack it
                    ns.print("hacking...");
                    await ns.hack(server);
                }
            }
            count++;
        }
        await ns.sleep(1000);
    }
} 