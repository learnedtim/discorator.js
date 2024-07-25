import WebSocket from "ws";
import Client from "./Client.js";
import EventEmitter from "node:events";
import Interaction from "../modules/server/ServerInteraction.js";

// whether to reconnect for each close code
/**
 * @see https://discord.com/developers/docs/topics/opcodes-and-status-codes#gateway-gateway-close-event-codes
 */
let closeCodes = {
    4000: [true, "Unknown Discord error"],
    4001: [true, "Unknown opcode (internal error, please make a bug report at https://github.com/learnedtim/discoratorjs)"],
    4002: [true, "Decode error"],
    4003: [true, "Not authenticated"],
    4004: [false, "Authentication failed"],
    4005: [true, "Already authenticated"],
    4007: [true, "Invalid sequence number (internal error, please make a bug report at https://github.com/learnedtim/discoratorjs)"],
    4008: [true, "Rate limited"],
    4009: [true, "Session timeout"],
    4010: [false, "Invalid shard"],
    4011: [false, "Sharding required"],
    4012: [false, "Invalid version (internal error, please make a bug report at https://github.com/learnedtim/discoratorjs)"],
    4013: [false, "Invalid intent(s) (potential internal error, please make a bug report at https://github.com/learnedtim/discoratorjs)"],
    4014: [false, "Disallowed intent(s)"],
}

export default class Gateway extends EventEmitter {
    #token;

    /**
     * 
     * @param {Client} client 
     * @param {Number} intents -- Takes a number, which is the intents to be used (see helper function calculateIntentBits in src/util/intents.js and src/util/intents.js for more information on intents)
     */
    constructor(client, intents) {
        super()
        if (!client) throw new Error("No client provided");
        if (!client.getToken()) throw new Error("No token provided");
        if (!intents) throw new Error("No intents provided");
        if (typeof intents !== "number") throw new Error("Intents must be a number");
        this.client = client
        this.listeners = {}
        this.intents = intents
        this.#token = this.client.getToken()
        this.alive = false
        this.sequence = null
        // whether first heartbeat has been sent
        this.hbResolve = null
        this.hbReady = new Promise((resolve) => {
            this.hbResolve = resolve
        })
        // whether connect is fully ready
        this.connectResolve = null
        this.connectReady = new Promise((resolve) => {
            this.connectResolve = resolve
        })
    }

    /**
     * Connect to the gateway
     */
    async connect() {
        this.ws = new WebSocket("wss://gateway.discord.gg");
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this)); // discord will send a Hello message, continue point is here
        this.ws.on("close", this.onClose.bind(this));
        this.ws.on("error", this.onError.bind(this));
        await this.hbReady; // wait for first heartbeat to be sent
        // identify
        this.send(2, {
            "token": this.#token,
            "intents": this.intents,
            "properties": {
                "os": "mac",
                "browser": "chrome",
                "device": "disco"
            }
        })
        await this.connectReady; // wait for connection to be fully ready (otherwhise this function will resolve BEFORE Ready is issued)
    }

    /**
     * Reconnect to the gateway
     */
    async resume(closeCode) {
        // If close code is unknown, reconnect. If one has been given, check if it allows for a reconnect
        if (closeCodes[closeCode]) {
            if (closeCodes[closeCode][0] == false) throw new Error("Reconnection failed: " + closeCodes[closeCode][1])
        } else {
            if (this.client.sysArgs.verbose == true) console.log("Reconnection failed: Unknown close code")
        }

        // Prepare promise for Hello
        this.hbReady = new Promise((resolve) => {
            this.hbResolve = resolve
        })

        // Reconnect
        delete this.ws;
        this.ws = new WebSocket(this.resumeGatewayUrl);
        this.ws.on("open", this.onOpen.bind(this));
        this.ws.on("message", this.onMessage.bind(this)); 
        this.ws.on("close", this.onClose.bind(this));
        this.ws.on("error", this.onError.bind(this));

        await this.hbReady; // wait for Hello to be sent

        // send resume
        this.send(6, {
            "token": this.#token,
            "session_id": this.sessionId,
            "seq": this.sequence
        })
        
    }

    /**
     * Close the connection
     */
    async close() {
        if (!this.ws) throw new Error("No connection to close");
        this.alive = false;
        this.ws.close();
    }

    /**
     * Send a message to Discord via the gateway
     * @param {Number} op -- opcode
     * @param {Object} data -- message contents/data
     */
    async send(op, data) {
        // temp
        this.ws.send(JSON.stringify({ op, d: data}))
    }

    /**
     * Open listener
     */
    async onOpen() {
        if (this.client.sysArgs.verbose == true) console.log('Discord socket opened!')
    }

    /**
     * Receive a message from Discord via the gateway
     * @param {String} msg -- message
     * @param {Boolean} isBinary -- whether message is binary
     */
    async onMessage(msg, isBinary) {
        msg = isBinary ? msg : msg.toString();
        msg = JSON.parse(msg);
        //console.log(msg)
        switch (msg.op) {
            case 0:
                // Event receive
                // incase of READY, resolve connectReady
                if (msg.t === "READY") {
                    this.resumeGatewayUrl = msg.d.resume_gateway_url
                    this.sessionId = msg.d.session_id
                    this.connectResolve()
                }
                this.sequence = msg.s;
                //console.log(msg)
                //this.dispatchEvent(msg.t, msg.d)

                // sometimes, event data needs to be processed (e.g. converting INTERACTION_CREATE to Interaction object)
                switch (msg.t) {
                    case "INTERACTION_CREATE":
                        // do something
                        msg.d = new Interaction(this.client, msg.d)
                        break;
                }

                // emit event 
                this.emit(msg.t, msg.d)
                break;
            case 1:
                // Force Heartbeat
                this.send(1, null, this.sequence)
                break;
            case 10:
                // Hello

                // if already connected, a heartbeat loop is not necessary
                if (this.hbInterval) {
                    this.hbResolve()
                    return
                }
                this.hbInterval = msg.d.heartbeat_interval;
                this.alive = true;
                this.heartbeat();
                break;
            case 11:
                // Heartbeat ACK
                this.sequence = msg.s;
                break; 
            default:
                //console.log(msg)
                break;
        }
    }

    /**
     * Receive an error from Discord via the gateway
     * @param {String} msg -- message
     * @param {Boolean} isBinary -- whether message is binary
     */
    async onError(msg, isBinary) {
        msg = isBinary ? msg : msg.toString();
        console.log(msg)
    }

    /**
     * Receive a close code from Discord via the gateway
     * @param {String} msg -- message
     * @param {Boolean} isBinary -- whether message is binary
     */
    async onClose(msg, isBinary) {
        msg = isBinary ? msg : msg.toString();

        if (this.alive == false) { console.log("Socket connection closed."); return }
        if (this.alive == true)  console.log("Connection closed uncleanly with exit code: " + msg)

        this.resume(msg)
    }

    /**
     * Infinite heartbeat loop, called by onMessage -> case 10 (Hello)
     */
    async heartbeat() {
        if (!this.hbInterval) throw new Error("No heartbeat interval provided");
        await new Promise(resolve => setTimeout(resolve, this.hbInterval * Math.random() * 0.1)); // NOTE: edited
        await this.send(1, { s: this.sequence })
        await this.hbResolve()
        do {
            await new Promise(resolve => setTimeout(resolve, this.hbInterval));
            await this.send(1, { s: this.sequence })
        } while (this.alive);

    }

    // Deprecated, use node:events instead
    /**
     * @deprecated Deprecated in favor of node:events
     * Event listener adder
     * @param {String} event -- What event to listen for
     * @param {Function} callback -- What to do when event is received
     */
    async addEventListener(event, callback) {
        if (!this.listeners[event]) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    /**
     * @deprecated Deprecated in favor of node:events
     * Event listener remover
     * @param {String} event 
     */
    async removeEventListener(event) {
        if (this.listeners[event]) {
            this.listeners[event] = [];
        } else {
            throw new Error("No event listener with that name");
        }
    }

    /**
     * @deprecated Deprecated in favor of node:events
     * Dispatch an event; received by any event listener, if any
     * @param {String} event 
     * @param {Object} data 
     */
    async dispatchEvent(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(callback => callback(data));
        }
    }  
}