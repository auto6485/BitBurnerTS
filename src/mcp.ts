import { NS } from '@ns'
import { BitServer, ServerState } from '/models/server';
import { disableLogs } from '/utils/logs';

const reservedHomeRam = 64;

const hosts: BitServer[] = [];
let currentScans: string[] = [];
let loopCoutner = 0;

const scriptPaths = {
    grow: '/processes/grow.js',
    hack: '/processes/hack.js',
    weaken: '/processes/weaken.js',

    growOnce: '/processes/grow.js',
    hackOnce: '/processes/hack.js',
    weakenOnce: '/processes/weaken.js',

    touch: '/spider/touch.js',
    watchSecurity: '/spider/watch-security.js',
    spider: '/spider/spider.js',
};

export async function main(ns: NS): Promise<void> {
    //ressetAllDataFiles(ns);
    disableLogs(ns);
    ns.clearLog();

    //puchase servers

    while (true) {
        evaluateOwnedServers(ns);

        // this is a little expensive, so run it less often
        if (loopCoutner % 10) {
            currentScans = [];
            recursiveScan(ns, 'home'); // scan the full network
        }

        evaluateHackingServers(ns);
        weakenHosts(ns);

        // without sleep, the game crashes
        loopCoutner++;
        await ns.sleep(10000);
    }
}

function evaluateOwnedServers(ns: NS) {
    if (!hosts.some(host => host.host === 'darkweb')) {
        hosts.push(new BitServer('darkweb', ServerState.Owned, ns.getServerMaxRam('darkweb'), 0));
    }

    // TODO: update existing to update tracked ram
    if (!hosts.some(host => host.host === 'home')) {
        hosts.push(new BitServer('home', ServerState.Owned, ns.getServerMaxRam('home'), 0));
    }

    const servers = ns.getPurchasedServers();
    while (servers.length > 0) {
        const server = servers.shift() ?? '';

        if (!hosts.some(host => host.host === server)) {
            hosts.push(new BitServer(server, ServerState.Owned, ns.getServerMaxRam(server), 0));
        }
    }
}

function recursiveScan(ns: NS, host: string) {
    for (const scan of ns.scan(host)) {
        if (!hosts.some(host => host.host === scan)) {
            hosts.push(new BitServer(scan, ServerState.Scanned, ns.getServerMaxRam(scan), 0));
        }

        // scan as much as we can to expand the host list.
        if (!currentScans.includes(scan)) {
            currentScans.push(scan);
            recursiveScan(ns, scan);
        }
    }
}

function evaluateHackingServers(ns: NS) {
    for (const host of hosts.filter(host => host.state === ServerState.Nuking)) {
        // not sure if the hack can fail, but verify just incase
        if (ns.hasRootAccess(host.host)) {
            host.state = ServerState.Nuked;
        } else {
            // retry the hack
            host.state = ServerState.Scanned;
        }
    }

    for (const host of hosts.filter(host => host.state === ServerState.Scanned)) {
        if (hackServer(ns, host.host)) {
            // hack isn't guaranteed:
            host.state = ServerState.Nuking;

            // clean up anything previously running
            ns.killall(host.host);
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

function weakenHosts(ns: NS): void {
    const homeRam = ns.getServerMaxRam('home');
    const weakeningCount = hosts.filter(host => host.state === ServerState.Weakening).length;

    for (const host of hosts.filter(host => host.state === ServerState.Weakening)) {
        if (homeRam < 8192 && weakeningCount >= 2) {
            continue;
        } else if (homeRam < 65536 && weakeningCount >= 3) {
            continue;
        }

        const currentSecurityLevel = ns.getServerSecurityLevel(host.host);
        const minimumSecurityLevel = ns.getServerMinSecurityLevel(host.host);
        const isAlreadyWeakened = currentSecurityLevel < 3 + minimumSecurityLevel;

        if (isAlreadyWeakened) {
            host.state = ServerState.Weakened;
        } else {
            const weakenThreadCount = Math.ceil(((currentSecurityLevel - minimumSecurityLevel) / 0.05));
            execProcess(ns, scriptPaths.weakenOnce, 'home', weakenThreadCount, [host.host]);
        }
    }
}

function growHosts(ns: NS) {
    const homeRam = ns.getServerMaxRam('home');
    const weakeningCount = hosts.filter(host => host.state === ServerState.Growing).length;

    for (const host of hosts.filter(host => host.state === ServerState.Weakened)) {
        //
    }
}

function execProcess(ns: NS, fileName: string, host: string, threads = 1, args: string[]): void {
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
        ns.exec(fileName, host, threadsAvailable, ...args);
    }
}