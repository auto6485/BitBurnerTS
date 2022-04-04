import { NS } from '@ns'
import { ressetAllDataFiles } from '/lib/file'
import { disableLogs } from '/lib/logs';
import { shortId } from '/lib/uuid';

const reservedHomeRam = 64;

let seenHosts: string[] = []; // every server out there
let controlledHosts: string[] = []; // servers that can run scripts (home, purchased, hacked, etc)
const scannedHosts: string[] = []; // servers that need evaluated
const hackedHosts: string[] = []; // servers that have been hacked, but not processed
let purchasedHosts: string[] = []; // servers that need evaluated

const weakeningHosts: string[] = []; // servers that are being weakened
const growingHosts: string[] = []; // servers that are being weakened
const hackingHosts: string[] = []; // servers that are being hacked

const scriptPaths = {
    grow: '/processes/grow.js',
    hack: '/processes/hack.js',
    weaken: '/processes/weaken.js',

    touch: '/spider/touch.js',
    watchSecurity: '/spider/watch-security.js',
    spider: '/spider/spider.js',
};

export async function main(ns: NS): Promise<void> {
    //ressetAllDataFiles(ns);
    disableLogs(ns);
    ns.clearLog();

    controlledHosts = ['home'].concat(ns.getPurchasedServers());
    seenHosts = ['darkweb'].concat(controlledHosts);

    while (true) {
        purchasedHosts = ns.getPurchasedServers();
        recursiveScan(ns, 'home'); // scan the full network
        evaluateScans(ns);
        evaluateHacked(ns);

        weakenHosts(ns);

        // without sleep, the game crashes
        await ns.sleep(10000);
    }
}

function recursiveScan(ns: NS, host: string) {
    for (const scan of ns.scan(host)) {
        if (scan === 'home' || scan === 'darkweb' || purchasedHosts.includes(scan)) {
            continue;
        }

        if (!seenHosts.includes(scan)) {
            seenHosts.push(scan);
        }

        // if aren't actively processing the server, add it for evaluation
        if (!controlledHosts.includes(scan) && !scannedHosts.includes(scan) &&
            !hackedHosts.includes(scan) && !weakeningHosts.includes(scan) && !growingHosts.includes(scan) && !hackingHosts.includes(scan)) {
            scannedHosts.push(scan);
        }

        // scan as much as we can to expand the host list.
        recursiveScan(ns, scan);
    }
}

function evaluateScans(ns: NS) {
    const scans = scannedHosts;
    for (const scan of scans) {
        if (hackServer(ns, scan)) {
            //server is newly hacked            
            hackedHosts.push(scan);
            scannedHosts.pop(scan);

            //incase we have stuff already running from a previous execution 
            ns.killall(scan);
        }
    }
}

function hackServer(ns: NS, target: string): boolean {
    const requiredHackingLevel = ns.getServerRequiredHackingLevel(target);
    const currentHackingLevel = ns.getHackingLevel();

    if (requiredHackingLevel > currentHackingLevel) {
        return false;
    }

    if (ns.hasRootAccess(target)) {
        return true;
    }

    let ports = 0;
    if (ns.fileExists('brutessh.exe', 'home')) {
        ns.brutessh(target);
        ports += 1;
    }
    if (ns.fileExists('ftpcrack.exe', 'home')) {
        ns.ftpcrack(target);
        ports += 1;
    }
    if (ns.fileExists('relaysmtp.exe', 'home')) {
        ns.relaysmtp(target);
        ports += 1;
    }
    if (ns.fileExists('httpworm.exe', 'home')) {
        ns.httpworm(target);
        ports += 1;
    }
    if (ns.fileExists('sqlinject.exe', 'home')) {
        ns.sqlinject(target);
        ports += 1;
    }

    if (ports < ns.getServerNumPortsRequired(target)) {
        return false;
    }

    ns.nuke(target);
    return true;
}

function evaluateHacked(ns: NS): void {
    const targets = hackedHosts;
    for (const target in targets) {
        const serverMaxMoney = ns.getServerMaxMoney(target);

        // some servers have no money, so no need to weaken / grow / hack them.
        if (serverMaxMoney > 0) {
            weakeningHosts.push(target);
        }

        hackedHosts.splice(target, 1);
    }
}

function weakenHosts(ns: NS) {
    const targets = weakeningHosts;
    for (const target in targets) {
        const currentSecurityLevel = ns.getServerSecurityLevel(target);
        const minimumSecurityLevel = ns.getServerMinSecurityLevel(target);
        const isAlreadyWeakened = currentSecurityLevel < 3 + minimumSecurityLevel;

        if (!isAlreadyWeakened) {
            const weakenThreadCount = Math.ceil(((currentSecurityLevel - minimumSecurityLevel) / 0.05));
            execProcess(ns, scriptPaths.weaken, 'home', weakenThreadCount, [target]);
        } else {
            weakeningHosts.pop(target);
            growingHosts.push(target);
        }
    }
}

function execProcess(ns, fileName, host, threads = 1, args) {
    const ramPerThread = ns.getScriptRam(fileName, 'home');
    const maxRam = ns.getServerMaxRam(host);
    const usedRam = ns.getServerUsedRam(host);
    let availableRam = maxRam - usedRam;

    if (host == 'home') {
        availableRam -= reservedHomeRam;
    }

    const threadsAvailable = Math.min(Math.floor(availableRam / ramPerThread), threads);

    if (threadsAvailable > 0) {
        // await ns.scp(fileName, "home", hostName);
        return ns.exec(fileName, host, threadsAvailable, ...args);
    }
}