import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.stopAction();
    ns.travelToCity("Sector-12");
    const combatTarget = ns.args[0];
    const charTarget = ns.args[1] || 0;
    const hackTarget = ns.args[2] || 0;
    ns.tail();

    while (ns.getPlayer().strength < combatTarget) {
        ns.gymWorkout('powerhouse gym', 'Strength');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().defense < combatTarget) {
        ns.gymWorkout('powerhouse gym', 'Defense');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().dexterity < combatTarget) {
        ns.gymWorkout('powerhouse gym', 'Dexterity');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().agility < combatTarget) {
        ns.gymWorkout('powerhouse gym', 'Agility');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().charisma < charTarget) {
        ns.universityCourse("Rothman University", "Leadership", true)
        await ns.sleep(10000);
    }

    while (ns.getPlayer().hacking < hackTarget) {
        ns.universityCourse("Rothman University", "Algorithms", true)
        await ns.sleep(10000);
    }
    
    ns.stopAction();
}