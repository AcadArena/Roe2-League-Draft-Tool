import * as ws from 'ws';
import * as fs from 'fs';
import * as http from 'http';

import logger from '../logging';
import { StateData } from '../types/dto';
import State from '../state';
import PBEvent from '../types/events/PBEvent';
import NewStateEvent from '../types/events/NewStateEvent';
import HeartbeatEvent from '../types/events/HeartbeatEvent';
import ChampSelectStartedEvent from '../types/events/ChampSelectStartedEvent';
import ChampSelectEndedEvent from '../types/events/ChampSelectEndedEvent';

const log = logger('websocket');

class WebSocketServer {
    server: ws.Server;
    state: State;
    clients: Array<WebSocket> = [];
    exampleClients: Array<WebSocket> = [];
    heartbeatInterval?: NodeJS.Timeout;

    constructor(server: http.Server, state: State) {
      this.server = new ws.Server({ server });
      this.state = state;

      this.sendHeartbeat = this.sendHeartbeat.bind(this);

      // Event listeners
      this.server.on('connection', (socket: WebSocket, request) => this.handleConnection(socket, request));


      state.on('stateUpdate', (newState: StateData) => this.sendEvent(new NewStateEvent(newState)));
      state.on('champSelectStarted', () => this.sendEvent(new ChampSelectStartedEvent()));
      state.on('champSelectEnded', () => this.sendEvent(new ChampSelectEndedEvent()))
    }

    startHeartbeat(): void {
      this.heartbeatInterval = setInterval(this.sendHeartbeat, 1000);
    }

    handleConnection(socket: WebSocket, request: http.IncomingMessage): void {
      if (request.url && request.url === '/example') {
        log.debug('New example client connected!');
        this.exampleClients.push(socket);
      } else {
        this.clients.push(socket);
        socket.send(JSON.stringify(new NewStateEvent(this.state.data)));
      }
    }

    sendEvent(event: PBEvent): void {
      const serializedEvent = JSON.stringify(event);
      log.debug(`New Event: ${serializedEvent}`);

      this.clients.forEach((client: WebSocket) => {
        client.send(serializedEvent);
      });
    }

    sendHeartbeat(): void {
      const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
      const heartbeatEvent = new HeartbeatEvent(config);
      const heartbeatSerialized = JSON.stringify(heartbeatEvent);

      this.clients.forEach((client: WebSocket) => {
        client.send(heartbeatSerialized);
      });

      const exampleData = fs.readFileSync('./example.json', 'utf8');
      this.exampleClients.forEach((client: WebSocket) => {
        client.send(JSON.stringify(new NewStateEvent(JSON.parse(exampleData))));
        client.send(heartbeatSerialized);
      });
    }
}

export default WebSocketServer;
