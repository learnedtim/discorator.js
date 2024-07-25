/**
 * Represents a channel
 * @extends Base
 * @prop {Array<Message>} messages Array of messages in the channel
 * @prop {String} name The name of the channel
 * @prop {String} id The ID of the channel
 * @prop {String} type The type of the channel
 */
export default class Channel {
    /**
     * 
     * @param {Client} client 
     * @returns 
     */
    constructor(client) {
        this.client = client;
        this.name;
        this.id;
        this.permissionOverwrites;
        return this;
    }


}