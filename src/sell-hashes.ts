import { NS } from '@ns';

export async function main(ns: NS): Promise<void> {
    ns.disableLog('sleep');
    const [name, target] = ns.args as string[];

    if (name) {
        await focusedTarget(ns, name, target);
    } else {
        await automated(ns);
    }
}

async function focusedTarget(ns: NS, name: string, target: string) {
    const purchasedItem = getHashItem(ns, name, target);

    while (true) {
        if (ns.hacknet.numHashes() > ns.hacknet.hashCost(purchasedItem)) {
            while (ns.hacknet.numHashes() > ns.hacknet.hashCost(purchasedItem)) {
                ns.hacknet.spendHashes(purchasedItem, target);
                await ns.sleep(10);
            }
        }
        await ns.sleep(10000);
    }
}

function getHashItem(ns: NS, name: string, target: string) {
    const requiresTarget = [
        'Reduce Minimum Security',
        'Increase Maximum Money',
    ]

    if (requiresTarget.includes(name) && !target) {
        ns.tprint(`ERROR: Command '${name}' requires second arg to specify target.`);
        ns.exit();
    }

    switch (name) {
        case 'money':
        case '$':
        default:
            return 'Sell for Money';
        case 'corp$':
        case 'corpMoney':
            return 'Sell for Corporation Funds';
        case 'research':
            return 'Exchange for Corporation Research';
        case 'gym':
            return 'Improve Gym Training';
        case 'university':
        case 'uni':
            return 'Improve Studying';
        case 'rank':
            return 'Exchange for Bladeburner Rank';
        case 'sec':
        case 'security':
            return 'Reduce Minimum Security';
        case 'serverMax':
            return 'Increase Maximum Money';
        case 'bbRank':
            return 'Exchange for Bladeburner Rank';
        case 'bbSp':
        case 'bbSP':
            return 'Exchange for Bladeburner SP';
    }
}

async function automated(ns: NS) {
    // variables for readability
    const mil = 1000000;
    const bil = 1000000000;
    let playerMoney = 0;

    // Hash to money conversion rate
    const conversion = mil / 4

    while (true) {
        playerMoney = ns.getPlayer().money;

        // Estimated value of each upgrade, tweak as desired
        const contractValue = Math.min(Math.max(100 * mil, 0.01 * playerMoney), 1 * bil)
        const bladeBurnerValue = Math.min(Math.max(10 * mil, 0.001 * playerMoney), 1 * bil)
        const corpValue = Math.min(Math.max(10 * mil, 0.01 * playerMoney), 1 * bil)
        const gymValue = Math.max(mil, 0.01 * playerMoney)

        // If we're in the gym, invest in it. 
        if (ns.getPlayer().location == 'Powerhouse Gym') {
            // If we're early in a run, get the first 5 upgrades to speed up training.
            if (ns.getPlayer().playtimeSinceLastBitnode < 24 * 60 * 60 * 1000 && ns.hacknet.getHashUpgradeLevel('Improve Gym Training') < 5) {
                ns.hacknet.spendHashes('Improve Gym Training');
            } else if (ns.hacknet.hashCost('Improve Gym Training') * conversion < gymValue) {
                ns.hacknet.spendHashes('Improve Gym Training');
            }
        }

        if (ns.getPlayer().location == 'Rothman University') {
            // If we're early in a run, get the first 5 upgrades to speed up training.
            if (ns.getPlayer().playtimeSinceLastBitnode < 24 * 60 * 60 * 1000 && ns.hacknet.getHashUpgradeLevel('Improve Studying') < 5) {
                ns.hacknet.spendHashes('Improve Studying');
            } else if (ns.hacknet.hashCost('Improve Studying') * conversion < gymValue) {
                ns.hacknet.spendHashes('Improve Studying');
            }
        }

        if (ns.getPlayer().factions.includes('Bladeburners')) {
            // If the node was recents started, ramp up quicker before caring about the money value.
            if (ns.getPlayer().playtimeSinceLastBitnode < 24 * 60 * 60 * 1000) {
                if (ns.hacknet.getHashUpgradeLevel('Exchange for Bladeburner Rank') < 5) {
                    ns.hacknet.spendHashes('Exchange for Bladeburner Rank');
                }
                if (ns.hacknet.getHashUpgradeLevel('Exchange for Bladeburner SP') < 5) {
                    ns.hacknet.spendHashes('Exchange for Bladeburner SP');
                }
            }

            if (ns.hacknet.hashCost('Exchange for Bladeburner Rank') * conversion < bladeBurnerValue) {
                ns.hacknet.spendHashes('Exchange for Bladeburner Rank');
            }

            if (ns.hacknet.hashCost('Exchange for Bladeburner SP') * conversion < bladeBurnerValue) {
                ns.hacknet.spendHashes('Exchange for Bladeburner SP');
            }
        }

        if (ns.getPlayer().hasCorporation) {
            if (ns.hacknet.hashCost('Exchange for Corporation Research') * conversion < corpValue) {
                ns.hacknet.spendHashes('Exchange for Corporation Research');
            }
            // Optional to build corp funds:
            // ns.hacknet.spendHashes('Sell for Corporation Funds')
        }

        // TODO: add 'Reduce Minimum Security' & 'Increase Maximum Money'
        // Ideally, this will go through the nuked servers
        // Optionally, can & should this improve the next server to be nuked?

        // Spend money on these whenever possible
        if (ns.hacknet.hashCost('Generate Coding Contract') * conversion < contractValue) {
            ns.hacknet.spendHashes('Generate Coding Contract');
        }

        // If we have nothing else to buy, sell the hashes for money.
        while (ns.hacknet.numHashes() / ns.hacknet.hashCapacity() >= 0.8) {
            ns.hacknet.spendHashes('Sell for Money');
        }
        await ns.sleep(1000);
    }
}