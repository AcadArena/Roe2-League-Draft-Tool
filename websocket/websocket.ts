import ws from 'ws';
import fs from 'fs';

import logger from '../logging';
const log = logger('websocket');
import state from '../state';
import lolcsui from "../types";
import StateData = lolcsui.dto.StateData;
import {IncomingMessage} from "http";


class WebSocket {
    server: ws.Server;
    clients: Array<any> = [];
    exampleClients: Array<any> = [];
    heartbeatInterval: NodeJS.Timeout;

    constructor(server: any) {
        this.server = new ws.Server({ server });

        this.sendHeartbeat = this.sendHeartbeat.bind(this);

        // Event listeners
        this.server.on('connection', (ws, request) => this.handleConnection(ws, request));
        state.on('stateUpdate', (state: any) => this.updateState(state));

        this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
    }

    handleConnection(ws: any, request: IncomingMessage) {
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        if (request.url && request.url === '/example') {
            log.info('New example client connected!');
            ws.send(JSON.stringify({'heartbeat': true, config}));
            this.exampleClients.push(ws);
        } else {
            this.clients.push(ws);
            ws.send(JSON.stringify({'heartbeat': true, config}));
            ws.send(JSON.stringify(state.data));
        }
    }

    updateState(newState: StateData) {
        log.debug(`New state: ${JSON.stringify(newState)}`);

        this.clients.forEach((client: any) => {
            client.send(JSON.stringify(newState));
        });
    }

    sendHeartbeat() {
        const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
        this.clients.forEach((client: any) => {
            client.send(JSON.stringify({'heartbeat': true, config}));
        });

        const exampleData = fs.readFileSync('./example.json', 'utf8');
        this.exampleClients.forEach((client: any) => {
            client.send(JSON.stringify(JSON.parse(exampleData)));
            client.send(JSON.stringify({'heartbeat': true, config}));
        });
    }
}

export default WebSocket;
