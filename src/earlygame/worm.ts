import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    //if no arguments provided tell the user how to use script.
    if (ns.args.length === 0) {
        ns.alert("Please include one or more arguments as server names to hack. The script will propogate across all servers and grow, weaken and hack the specified targets. As you get new hacking tools, kill all scripts and rerun from home.");
        return;
    }

    if (ns.args[0] === 1) {
        ns.args[0] = "n00dles";
        ns.args[1] = "foodnstuff";
    }

    if (ns.args[0] === 2) {
        ns.args[0] = "n00dles";
        ns.args[1] = "foodnstuff";
        ns.args[2] = "sigma-cosmetics";
        ns.args[3] = "joesguns";
        ns.args[4] = "hong-fang-tea";
        ns.args[5] = "harakiri-sushi";
        ns.args[6] = "iron-gym";
        ns.args[7] = "crush-fitness";
        //ns.args[8] = "omega-net";
        //ns.args[9] = "phantasy";
        //ns.args[10] = "silver-helix";
    }

    if (ns.args[0] === 3) {
        ns.args[0] = "n00dles";
        ns.args[1] = "foodnstuff"; //1
        ns.args[2] = "sigma-cosmetics"; //5
        ns.args[3] = "joesguns"; //10
        ns.args[4] = "nectar-net"; //20
        ns.args[5] = "hong-fang-tea"; //30
        ns.args[6] = "harakiri-sushi"; //40
        ns.args[7] = "neo-net"; //50
        ns.args[8] = "zer0"; //75
        ns.args[9] = "max-hardware"; //80
        ns.args[10] = "iron-gym"; //100
        ns.args[11] = "phantasy"; //100
        ns.args[12] = "silver-helix"; //150
        ns.args[13] = "omega-net"; //200
        ns.args[14] = "crush-fitness"; //250
        ns.args[15] = "johnson-ortho"; //	275
        ns.args[16] = "the-hub"; //	300
        ns.args[17] = "comptek"; //	350
        ns.args[18] = "netlink"; //	400
        ns.args[19] = "rothman-uni"; //	400
        ns.args[20] = "catalyst"; //	425
        ns.args[21] = "summit-uni"; //	450
        ns.args[22] = "rho-construction"; //	500
        ns.args[23] = "millenium-fitness"; //	500
        ns.args[24] = "aevum-police"; //	425
        ns.args[25] = "alpha-ent"; //	550
        ns.args[26] = "syscore"; //	600
        ns.args[27] = "lexo-corp"; //	700
        ns.args[28] = "snap-fitness"; //	750
        ns.args[29] = "global-pharm"; //	775
        ns.args[30] = "applied-energetics"; //	775
        ns.args[31] = "unitalife"; //	790
        ns.args[32] = "univ-energy"; //	790
        ns.args[33] = "nova-med"; //	800
        ns.args[34] = "zb-def"; //	800
        ns.args[35] = "zb-institute"; //	750
        ns.args[36] = "vitalife"; //	775
        ns.args[37] = "titan-labs"; //	795
        ns.args[38] = "solaris"; //	800
        ns.args[39] = "microdyne"; //	800
        ns.args[40] = "helios"; //	800
        ns.args[41] = "deltaone"; //	810
        ns.args[42] = "icarus"; //	810
        ns.args[43] = "zeus-med"; //	810
        ns.args[44] = "omnia"; //	825
        ns.args[45] = "defcomm"; //	825
        ns.args[46] = "galactic-cyber"; //	825
        ns.args[47] = "infocomm"; //	830
        ns.args[48] = "taiyang-digital"; //	850
        ns.args[49] = "stormtech"; //	850
        ns.args[50] = "aerocorp"; //	850
        ns.args[51] = "clarkinc"; //	900
        ns.args[52] = "omnitek"; //	900
        ns.args[53] = "nwo"; //	900
        ns.args[54] = "4sigma"; //	900
        ns.args[55] = "blade"; //	900
        ns.args[56] = "b-and-a"; //	900
        ns.args[57] = "ecorp"; //	900
        ns.args[58] = "fulcrumtech"; //	900
        ns.args[59] = "megacorp"; //	900
        ns.args[60] = "kuai-gong"; //	925
        ns.args[61] = "fulcrumassets"; //	999
        ns.args[62] = "powerhouse-fitness"; //	1000
    }

    const ogArgs = ns.args;
    ns.toast('Running worm on ' + ns.getHostname());
    const hostservers = ns.scan(ns.getHostname());                                                             //get all servers you can connect to
    const scriptram = ns.getScriptRam('/earlygame/worm.js', 'home');                                                      //get ram for this script
    const hackscriptram = ns.getScriptRam('/earlygame/hackservers.js', 'home');                                           //get ram for hack script
    const avsram = ns.getServerMaxRam(ns.getHostname()) - ns.getServerUsedRam(ns.getHostname()) + scriptram;   //get available server ram for this server
    const hsthreads = Math.floor(avsram / hackscriptram);                                                      //calculate usethreads for hack script for this server

    await attackAll(hostservers, ns.getHostname());

    if (hsthreads) {                                                                                          //if usethreads exists for this script, build args array of parameters based on this scripts args
        const hsargs = [];
        for (const argument of ns.args) {
            hsargs.push(argument);
            hsargs.push(ns.getServerMinSecurityLevel(argument));
            hsargs.push(ns.getServerMaxMoney(argument));
            hsargs.push(ns.getServerRequiredHackingLevel(argument));
        }
        if (ns.getHostname() != 'home') {                                                                       //copy hack script to this server and spawn script with threads and arguments as a single string
            await ns.scp('/earlygame/hackservers.js', 'home', ns.getHostname());
        }
        ns.spawn('/earlygame/hackservers.js', hsthreads, hsargs.toString());
    }

    async function attackAll(servers: string[], host: string) {
        for (const server of servers) {
            await attack(server);
            if (ns.getServerMaxRam(server) >= ns.getServerUsedRam(server) + scriptram) {                           //if the server has enough ram to run the worm script
                await worm(server);
            } else {                                                                                               //if server can't run script, look at servers it can connect to, gain root, and run script there
                const moreservs = ns.scan(server);
                moreservs.splice(moreservs.indexOf(host), 1);
                await attackAll(moreservs, server);
            }
        }
    }

    async function attack(server: string) {
        let hacktoolnum = 0;
        //count and use hack tools owned if you don't have root
        if (!ns.hasRootAccess(server)) {
            ns.toast('Opening ports on ' + server);
            if (ns.fileExists('BruteSSH.exe', 'home')) {
                ns.brutessh(server);
                hacktoolnum++;
            }
            if (ns.fileExists('FTPCrack.exe', 'home')) {
                ns.ftpcrack(server);
                hacktoolnum++;
            }
            if (ns.fileExists('relaySMTP.exe', 'home')) {
                ns.relaysmtp(server);
                hacktoolnum++;
            }
            if (ns.fileExists('HTTPWorm.exe', 'home')) {
                ns.httpworm(server);
                hacktoolnum++;
            }
            if (ns.fileExists('SQLInject.exe', 'home')) {
                ns.sqlinject(server);
                hacktoolnum++;
            }
        }

        if (ns.getServerNumPortsRequired(server) <= hacktoolnum && !ns.hasRootAccess(server)) {
            ns.toast("nuking " + server);
            ns.nuke(server);
        }

        if (!ns.hasRootAccess(server)) {
            ns.toast("unable to gain root to " + server, "error");
        }
    }

    async function worm(server: string | undefined) {
        //copy WORM script to server and run
        if (!ns.fileExists('/earlygame/worm.js', server)) {
            ns.print('/earlygame/worm.js being copied to ' + server);
            await ns.scp('/earlygame/worm.js', 'home', server);
        }

        //if you don't see either script running on target server, run worm on it.
        if (!ns.scriptRunning('/earlygame/worm.js', server) && !ns.scriptRunning('/earlygame/hackservers.js', server)) {
            ns.print('running worm on ' + server);
            await ns.sleep(11000);
            await ns.scp('/earlygame/worm.js', 'home', server);
            ns.exec('/earlygame/worm.js', server, 1, ...ogArgs);
        }
    }
}