import generateNonce from '../../util/Nonce.js';
import Channel from './Channel.js';
import Message from './Message.js';

/**
 * Represents a text channel
 * @extends Channel
 * @prop {String} topic The topic of the channel
 * @prop {Number} lastMessageID The ID of the last message in the channel
 */
export default class TextChannel extends Channel {
    /**
     * 
     * @param {Client} client 
     */
    constructor(client) {
        super(client);
        return this;
    }

    /**
     * Fetches a specific channel
     */
    async fetch(id) {
        try {
            let res = await this.client.apiRequest({
                method: 'GET',
                endpoint: `/channels/${id}`
            })
            console.log(res)
            Object.assign(this, res);
            Object.assign(this, res.data); // unpack data
            delete this.data;

            console.log(this)
            return this;
        } catch (err) {
            return err;
        }
    }

    /**
     * 
     * @param {Message|String} message 
     */
    async send(message) {
        if (!this.id) throw new Error('Cannot make a request without a initialized channel')

        if (typeof message === 'string') message = new Message(this.client).setContent(message);
        if (typeof message === 'object' && message instanceof Message === false) message = new Message(this.client, message);

        if (message instanceof Message) {
            message.clean()
            message = message.toJSON()
        }

        let res = await this.client.apiRequest({
            method: "POST",
            endpoint: `/channels/${this.id}/messages`,
            payload: message
        })
        console.log(res)
    }

    /**
     * Easy way to create a DM channel with a user, does not work with guilds and this channel may not be initialized
     * @@deprecated DO NOT USE - Incorrect usage will lead to Discord permamently flagging your account
     * @param {Number} userId 
     */
    async createDM(userId) {
        if (!userId) throw new Error('User ID is required to create a DM channel')
        let res = await this.client.apiRequest({
            method: 'POST',
            endpoint: `/users/@me/channels`,
            payload: {
                recipient_id: userId
            }
        })
        console.log(res)
        
        // fetch that channel
        let res2 = await this.fetch(res.id)
        return res2;
    }

    /**
     * @returns {Object} -- Array of commands available in the channel
     */
    async fetchCommands() {
        if (!this.id) throw new Error('Cannot make a request without a initialized channel')

        // guild or dm has different endpoints
        let res;
        if (this.guild_id) {
            res = await this.client.apiRequest({
                method: 'GET',
                endpoint: `/guilds/${this.guild_id}/application-command-index`
            })
        } else {
            res = await this.client.apiRequest({
                method: 'GET',
                endpoint: `/channels/${this.id}/application-command-index`
            })
        }
        res = res.data
        return res
    }

    /**
     * 
     * @param {String} name 
     * @param {Number|User} [appId=null] -- application id or the Bot User object
     */
    async getCommand(name, appId = null) {
        let commands = await this.fetchCommands()
        let res = await commands.application_commands.filter(c => c.name === name)
        if (appId) {
            res = await res.filter(c => c.application_id === appId)
            res = res[0]
        }
        return res
    }

    /**
     * Client-only method
     * Emits a command to the channel
     * @param {Number} commandId
     * @param {Number|User} bot -- application id or the Bot User object
     * @param {Object} options -- options to send with the command
     */
    async emitCommand(commandName, bot, options=[]) {
        // TODO: take ClientInteraction object only

        if (typeof bot === 'object') bot = bot.id

        // get the command
        let command = await this.getCommand(commandName, bot)

        // construct the payload
        let body = {}
        body.type = 2
        body.application_id = bot
        body.guild_id = this.guild_id
        body.channel_id = this.id
        body.session_id = this.client.gateway.sessionId
        body.nonce = generateNonce()
        body.analytics_location = 'slash_ui'

        body.data = {}
        body.data.version = command.version
        body.data.id = command.id
        body.data.name = command.name
        body.data.type = command.type
        body.data.options = command.options
        body.data.attachments = [] // always empty with application commands
        body.data.application_command = command

        console.log(body)

        // send the command
        let res = await this.client.apiRequest({
            method: 'POST',
            endpoint: `/interactions`,
            payload: body
        })
        console.log(res)
        return res
    }
}