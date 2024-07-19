import MessageFlags from "../../util/MessageFlags.js";

export default class Message {
    /**
     * @param {Client} client 
     * @param {number} type -- see https://discord.com/developers/docs/resources/channel#message-object
     * @param {Object} message -- partial json array 
     */
    constructor(client, type=0, message=null) {
        this.client = client;
        this.type = type;

        if (message) {
            Object.assign(this, message);
        }

        return this;
    }

    /**
     * 
     * @param {*} content 
     * @returns 
     */
    setContent(content) {
        this.content = content;
        return this;
    }

    /**
     * Embed adding
     * @param {Embed} embed -- todo
     * @returns 
     */
    addEmbed(embed) {
        // embed object
        this.embeds.push(embed);
        return this;
    }

    /**
     * @param {Attachment} attachment 
     * @returns 
     */
    addAttachment(attachment) {
        if (!this.attachments) {
            this.attachments = [];
        }
        this.attachments.push(attachment);
        return this;
    }

    /**
     * Add a Poll
     * @param {Poll} poll
     */
    addPoll(poll) {
        this.poll = poll;
        return this;
    }

    /**
     * Add an action row
     * @param {ActionRow} actionRow 
     */
    addActionRow(actionRow) {
        if (!this.components) {
            this.components = [];
        }
        this.components.push(actionRow);
    }

    /**
     * 
     * @param {boolean} tts -- text to speech (default: true)
     * @returns 
     */
    setTts(tts=true) {
        this.tts = tts;
        return this;
    }

    /**
     * Add flags (internal method)
     * @param {MessageFlags} flag
     */
    #addFlag(flag) {
        if (!this.flags) {
            this.flags = 0;
        }
        this.flags |= flag;
        return this;
    }

    /**
     * Set message as ephemeral
     * @param {boolean} bool
     */
    setEphemeral(bool=true) {
        if (bool == true) {
            this.#addFlag(MessageFlags.Ephemeral);
        } else {
            throw new Error('Cannot set ephemeral to false, in relation to bitfields this feature is currently not supported.');
        }
    }

    /**
     * Clean: remove all unnecessary data and methods not needed for sending
     */
    clean() {
        delete this.client
        delete this.type
        
        // delete all methods
        for (let key in this) {
            if (typeof this[key] === 'function' && key !== 'clean') {
                delete this[key]
            }
        }
        delete this['clean']
    }

    /**
     * 
     * @returns 
     */
    toJSON() {
        return Object.getOwnPropertyNames(this).reduce((a, b) => {
          a[b] = this[b];
          return a;
        }, {});
      }

}