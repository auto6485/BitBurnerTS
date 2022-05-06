import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const intervalSeconds = 1000;
    ns.disableLog('ALL');
    
    let ram = parseInt((ns.args[0] as string) || ns.getServerMaxRam('home').toString());
    const serverCount = ns.args[1] as string || ns.getPurchasedServerLimit(); 
    let purchasedServerCount = ns.getPurchasedServers().length;

    if (ram > 1048576) {
        ram = 1048576;
    }
    // ns.tprint("ram settings: " + ram);
    // ns.tprint("server count: " + serverCount);

    while (purchasedServerCount <= serverCount && purchasedServerCount <= ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
            const hostname = ns.purchaseServer(`gserv-${purchasedServerCount}`, ram);
            ns.tprint(`Purchased server: ${hostname}@${ram / 1000 / 1000}PB`);
            purchasedServerCount += 1;
        }
        await ns.sleep(intervalSeconds);
    }
}
