import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    // ns.run('/purchase/programs.js');
    // await ns.sleep(50);
    ns.run('watcher.js');
    await ns.sleep(50);
    ns.run('stats.js');
    await ns.sleep(50);
    ns.run('spider.js');
    await ns.sleep(50);
    // ns.run('/garrett/stockmaster.js');
    ns.run('/garrett/stockmasterbasic.js');
    await ns.sleep(50);
    ns.run('/dave/gangs.js');
    // await ns.sleep(50);
    // ns.run('crime.js');
    await ns.sleep(500);
    ns.run('/scheduler/scheduler.js');
    //ns.run('scheduler.js');
    //await ns.sleep(50);
    // await ns.sleep(20000);
    // ns.run('/purchase/programs.js');
}