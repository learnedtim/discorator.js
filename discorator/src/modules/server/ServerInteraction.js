// purely for code completion & jsdoc
import Client from "../../client/Client.js";
import Message from "../shared/Message.js";

/**
 * Used by the Gateway for transforming payload to Interaction object
 * Interaction class; this is not used to send an Interaction, only receive.
 * @class Interaction
 * @see https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-object-interaction-structure
 */
export default class Interaction {
    /**
     * 
     * @param {Client} client 
     * @param {Json} data -- Gateway payload 
     */
    constructor(client, data) {
        this.client = client;
        this.replied = false; // Flag to check if the interaction has been replied to
        Object.assign(this, data); // Set inbound data to this object for easy access

        // Note: props Channel, Member, User, Roles are stil to be migrated to their own classes.
        // Make Data easier to access
    }

    /**
     * Base Response
     * @param {Number} type 
     * @param {String|Message|Autocomplete|Modal} data -- Response data
     */
    async #respond(type, data) {
        await this.client.apiRequest({
            method: "POST",
            endpoint: `/interactions/${this.id}/${this.token}/callback`,
            payload: {
                "type": type,
                "data": data
            }
        })
    }

    /**
     * Reply to the Interaction with a message
     * @param {String|Message} message
     */
    async reply(message, ephemeral=false) {
        if (this.replied == true) throw new Error("Interaction already replied to");

        // convert to Message object
        if (typeof message === 'string') message = new Message(this.client).setContent(message);
        if (typeof message === 'object' && message instanceof Message === false) message = new Message(this.client, message);

        if (ephemeral) message.setEphemeral(true);


        if (message instanceof Message) {
            message.clean()
            message = message.toJSON()
        }

        // temp until Message class exists
        await this.#respond(4, message); // 4: CHANNEL_MESSAGE_WITH_SOURCE
    }

    /**
     * Defer the reply to the Interaction
     * May contain a message or not
     */
    async defer() {
        if (this.replied == true) throw new Error("Interaction already replied to");
        await this.#respond(5, null); // 5: DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE
    }

    /**
     * Followup
     * After a message has been deferred, you can send followup messages
     */
    async followUp(message, ephemeral=false) {
        if (this.replied == false) throw new Error("Interaction has not been replied to yet");

        // convert to Message object
        if (typeof message === 'string') message = new Message(this.client).setContent(message);
        if (typeof message === 'object' && message instanceof Message === false) message = new Message(this.client, message);

        if (ephemeral) message.setEphemeral(true);


        if (message instanceof Message) {
            message.clean()
            message = message.toJSON()
        }

        // temp until Message class exists
        await this.#respond(4, message); // 4: CHANNEL_MESSAGE_WITH_SOURCE
    }

    /**
     * 
     */
    async editReply() {
        // todo
    }

    /**
     * 
     */
    async editInitialMessage() {

    }

    /**
     * 
     */
    async deferEdit() {

    }   
}

let h = new Interaction()