import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.stopAction();
    ns.travelToCity("Sector-12");
    const target = ns.args[0];

    while (ns.getStats().strength < target) {
        ns.gymWorkout('Powerhouse Gym', 'str');
        await ns.sleep(60000);
        ns.stopAction();
    }
}