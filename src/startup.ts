import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const player = ns.getPlayer();

    ns.run('/purchase/programs.js');
    await ns.sleep(50);
    ns.run('watcher.js');
    await ns.sleep(50);
    ns.run('stats.js');
    await ns.sleep(50);
    ns.run('spider.js');

    await ns.sleep(50);
    if (player.hasTixApiAccess || player.has4SData || player.has4SDataTixApi) {
        ns.run('stocktrader.js');
    } else {
        ns.run('stockmaster.js');
    }

    if (ns.gang.inGang()) {
        await ns.sleep(50);
        ns.run('gangs.js');

        await ns.sleep(50);
        ns.run('crime.js');
    } else {
        await ns.sleep(50);
        ns.run('crime.js -k');
    }

    if (ns.getPlayer().factions.includes("Bladeburners")) {
        await ns.sleep(50);
        ns.run('bladeburner.js');
    }

    ns.run('hashnet.js', 1, '-t');
    ns.run('sell-hashes.js');

    await ns.sleep(500);
    ns.run('scheduler.js');
}