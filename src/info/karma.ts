import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    //ns.tprint("karma: " + ns.getCrimeStats("homicide").karma);
    ns.tprint("karma: " + ns.heart.break());
}