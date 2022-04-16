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
/info/purchaseServerCosts.js: 128 GB costs: $7.04m
/info/purchaseServerCosts.js: 256 GB costs: $14.08m
/info/purchaseServerCosts.js: 512 GB costs: $28.16m
/info/purchaseServerCosts.js: 1024 GB costs: $56.32m
/info/purchaseServerCosts.js: 2048 GB costs: $112.64m
/info/purchaseServerCosts.js: 4096 GB costs: $225.28m
/info/purchaseServerCosts.js: 8192 GB costs: $450.56m
/info/purchaseServerCosts.js: 16384 GB costs: $901.12m
/info/purchaseServerCosts.js: 32768 GB costs: $1.80b
/info/purchaseServerCosts.js: 65536 GB costs: $3.60b
/info/purchaseServerCosts.js: 131072 GB costs: $7.21b
/info/purchaseServerCosts.js: 262144 GB costs: $14.42b
/info/purchaseServerCosts.js: 524288 GB costs: $28.84b
/info/purchaseServerCosts.js: 1048576 GB costs: $57.67b
*/