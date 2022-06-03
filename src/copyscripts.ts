import { NS } from '@ns'

export async function main(ns: NS): Promise<void> {
    const host = ns.args[0] as string;

    await copyFiles(ns, ns.ls('home', '/scripts/'), host);
    await copyFiles(ns, ns.ls('home', '/utils/'), host);
}

async function copyFiles(ns: NS, files: any, host: string) {
    await ns.scp(files, host);
}