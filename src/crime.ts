import { NS } from '@ns'
import { disableLogs } from '/utils/logger';

function getCrime(param: string): string {
    switch (param) {
        case 'b':
        case 'bond':
            return 'bond forgery';
        case 'd':
        case 'drug':
        case 'drugs':
            return 'deal drugs';
        case 'gta':
            return 'grand theft auto';
        case 'he':
        case 'heist':
            return 'heist';
        case 'h':
        case 'ho':
        case 'hom':
        case 'homicide':
            return 'homicide';
        case 'm':
        default:
            return 'mug';
        case 'r':
        case 'rob':
            return 'rob store';
        case 's':
            return 'shoplift';
    }
}

async function doCrime(ns: NS, crime: string): Promise<void> {
    ns.tail();

    ns.commitCrime(crime);
    while (ns.isBusy()) {
        await ns.sleep(100);
    }
}

export async function main(ns: NS): Promise<void> {
    disableLogs(ns);
    const [crimeParam] = ns.args[0] as string || 'h';
    ns.tail();
    while (true) {
        await doCrime(ns, getCrime(crimeParam));
    }
}
