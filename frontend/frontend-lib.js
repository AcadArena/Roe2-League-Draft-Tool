/* Event Emitter */
const eventify = (self) => {
    self.events = {};

    self.on = function (event, listener) {
        if (typeof self.events[event] !== 'object') {
            self.events[event] = []
        }

        self.events[event].push(listener)
    };

    self.removeListener = function (event, listener) {
        let idx;

        if (typeof self.events[event] === 'object') {
            idx = self.events[event].indexOf(listener);

            if (idx > -1) {
                self.events[event].splice(idx, 1)
            }
        }
    };

    self.emit = function (event) {
        let i, listeners, length, args = [].slice.call(arguments, 1);

        if (typeof self.events[event] === 'object') {
            listeners = self.events[event].slice();
            length = listeners.length;

            for (i = 0; i < length; i++) {
                listeners[i].apply(self, args)
            }
        }
    };

    self.once = function (event, listener) {
        self.on(event, function g () {
            self.removeListener(event, g);
            listener.apply(self, arguments)
        })
    };
};

const PB = {};
eventify(PB);

PB.start = function() {
    this.backend = window.location.search.substring(1);

    console.log("[PB] Connecting to ws backend on " + this.backend);

    const connect = () => {
        this.socket = new WebSocket(this.backend);
        this.emit('statusChange', 'CONNECTING');

        this.socket.onopen = () => {
            this.emit('statusChange', 'CONNECTED');
            console.log('[PB] Connection established!')
        };
        this.socket.onclose = () => {
            this.emit('statusChange', 'CLOSED');
            setTimeout(connect, 500);
            console.log('[PB] Attempt reconnect in 500ms');
        };
        this.socket.onerror = () => {
            this.emit('statusChange', 'ERROR');
        }
    };

    connect();
};
