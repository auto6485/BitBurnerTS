import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    let i = 1;
    while (i <= 20) {
        const ramAmount = Math.pow(2, i);
        const serverCost = ns.getPurchasedServerCost(ramAmount);
        ns.tprint(ramAmount + " GB costs: " + ns.nFormat(serverCost, "$0.00a"));
        i++;
    }
}

/*
/info/purchaseServerCosts.js: 2 GB costs: $110.00k
/info/purchaseServerCosts.js: 4 GB costs: $220.00k
/info/purchaseServerCosts.js: 8 GB costs: $440.00k
/info/purchaseServerCosts.js: 16 GB costs: $880.00k
/info/purchaseServerCosts.js: 32 GB costs: $1.76m
/info/purchaseServerCosts.js: 64 GB costs: $3.52m
/info/purchaseServerCosts.js: 128 GB costs: $8.45m
/info/purchaseServerCosts.js: 256 GB costs: $20.28m
/info/purchaseServerCosts.js: 512 GB costs: $48.66m
/info/purchaseServerCosts.js: 1024 GB costs: $116.79m
/info/purchaseServerCosts.js: 2048 GB costs: $280.28m
/info/purchaseServerCosts.js: 4096 GB costs: $672.68m
/info/purchaseServerCosts.js: 8192 GB costs: $1.61b
/info/purchaseServerCosts.js: 16384 GB costs: $3.87b
/info/purchaseServerCosts.js: 32768 GB costs: $9.30b
/info/purchaseServerCosts.js: 65536 GB costs: $22.32b
/info/purchaseServerCosts.js: 131072 GB costs: $53.56b
/info/purchaseServerCosts.js: 262144 GB costs: $128.55b
/info/purchaseServerCosts.js: 524288 GB costs: $308.52b
/info/purchaseServerCosts.js: 1048576 GB costs: $740.46b
*/