import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const hosts = ns.getPurchasedServers();
    const ramPerThread = ns.getScriptRam('share.js');

    while (hosts.length > 0) {
        const host = hosts.shift() || '';
        const maxRam = ns.getServerMaxRam(host);
        const usedRam = ns.getServerUsedRam(host);
        const availableRam = maxRam - usedRam;
        const threadsAvailable = Math.floor(availableRam / ramPerThread);

        await ns.scp('share.js', host);

        if (threadsAvailable > 0) {
            await ns.exec('share.js', host, threadsAvailable);
        }
    }
}