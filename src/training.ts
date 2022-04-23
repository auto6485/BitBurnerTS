import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    ns.stopAction();
    ns.travelToCity("Sector-12");
    const target = ns.args[0];

    while (ns.getPlayer().strength < target) {
        ns.gymWorkout('powerhouse gym', 'Strength');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().defense < target) {
        ns.gymWorkout('powerhouse gym', 'Defense');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().dexterity < target) {
        ns.gymWorkout('powerhouse gym', 'Dexterity');
        await ns.sleep(10000);
    }

    while (ns.getPlayer().agility < target) {
        ns.gymWorkout('powerhouse gym', 'Agility');
        await ns.sleep(10000);
    }
    
    ns.stopAction();
}


/*
export async function main(ns) {
    while (true) {
        let p = ns.getPlayer();
        if (p.strength < p.defense && p.strength < p.dexterity && p.strength < p.agility){
            ns.gymWorkout('powerhouse gym', 'Strength');
        }
        else if(p.defense < p.dexterity && p.defense < p.agility){
            ns.gymWorkout('powerhouse gym', 'Defense');
        }
        else if(p.dexterity < p.agility){
            ns.gymWorkout('powerhouse gym', 'Dexterity');
        }
        else{
            ns.gymWorkout('powerhouse gym', 'Agility')
        }   
        await ns.sleep(100);
        ns.stopAction()
    }
}
*/