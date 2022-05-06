export interface IBitServer {
    host: string;
    state: ServerState
    availableRam: number;
    maxMoney: number;
}

export class BitServer implements IBitServer {
    host = '';
    state: ServerState = ServerState.Scanned;
    availableRam = 0;
    maxMoney = 0;

    constructor(hostName: string, initialState: ServerState, ram: number, maxMoney: number) {
        this.host = hostName;
        this.state = initialState;
        this.availableRam = ram;
        this.maxMoney = maxMoney;
    }
}

export enum ServerState {
    Owned,
    Scanned,
    Nuking,
    Nuked,
    Weakening,
    Weakened,
    Growing,
    Grown,
    Hacking
}