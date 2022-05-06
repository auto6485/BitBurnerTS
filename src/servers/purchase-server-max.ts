import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const intervalSeconds = 30 * 10;
    ns.disableLog('sleep');
    ns.disableLog('getServerMoneyAvailable');

    const purchaseUpTo = ns.args[0];
    const ram = Math.floor(1048576); // It's over 9000

    let purchasedServerCount = ns.getPurchasedServers().length;

    while (purchasedServerCount <= purchaseUpTo && purchasedServerCount <= ns.getPurchasedServerLimit()) {
        if (ns.getServerMoneyAvailable('home') > ns.getPurchasedServerCost(ram)) {
            const hostname = ns.purchaseServer(`gserv-${purchasedServerCount}`, ram);
            ns.tprint(`Purchased server: ${hostname}@${ram / 1000 / 1000}PB`);
            purchasedServerCount += 1;
        }
        await ns.sleep(intervalSeconds);
    }
}
