import { NS } from '@ns'
import { formatMoney, getStocksValue } from '/helpers';

export async function main(ns: NS): Promise<void> {
    const doc = eval('document');
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');
    while (true) {
        try {
            const headers = []
            const values = [];

            const stkPortfolio = await getStocksValue(ns);
            if (stkPortfolio > 0 && !doc.getElementById("stock-display-1")) {
                headers.push("Stock Value: ");
                values.push('   ' + ns.nFormat(stkPortfolio, '$0,0'));

                headers.push('---------------------')
                values.push('-----------------------')
            }

            if (ns.gang.inGang()) {
                headers.push("Gang Income: ");
                values.push('   ' + ns.nFormat((5 * ns.gang.getGangInformation()['moneyGainRate']), '$0,0') + ' /s');
            }

            const hacknetNodeCount = ns.hacknet.numNodes();
            if (hacknetNodeCount > 0) {
                let production = 0;
                for (let i = 0; i < hacknetNodeCount; i++) {
                    production += ns.hacknet.getNodeStats(i).production;
                }

                headers.push('Hacknet Income: ');
                values.push('   ' + ns.nFormat(production, '$0,0') + ' /s');
            }

            if (ns.getScriptIncome()[0] > 0) {
                const args: string[] = [];
                headers.push('Hack Income: ');
                values.push('   ' + ns.nFormat(ns.getScriptIncome('scheduler.js', 'home', ...args), '$0,0') + ' /s');

                headers.push('Stock Income: ');
                if (ns.getPlayer().hasTixApiAccess) {
                    values.push('   ' + ns.nFormat(ns.getScriptIncome('stocktrader.js', 'home', ...args), '$0,0') + ' /s');
                } else {
                    values.push('   ' + ns.nFormat(ns.getScriptIncome('stockmaster.js', 'home', ...args), '$0,0') + ' /s');
                }
            }

            headers.push('---------------------')
            values.push('-----------------------')

            headers.push('HOME Ram Use: ')
            values.push(ns.nFormat(ns.getServerUsedRam('home'), '0,0') + ' / ' + ns.nFormat(ns.getServerMaxRam('home'), '0,0'))

            // headers.push('---------------------')
            // values.push('-----------------------')

            // headers.push(ns.getPlayer()['city'])
            // values.push(ns.getPlayer()['location'])

            hook0.innerText = headers.join(" \n");
            hook1.innerText = values.join("\n");
        } catch (err) {
            ns.print("ERROR: Update Skipped: " + String(err));
        }
        await ns.sleep(2000);
    }
}
