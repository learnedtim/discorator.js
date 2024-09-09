import { EmbedField } from './EmbedField.js';

/**
 * @class EmbedBuider
 * @description Used to build an Embed Object. Only works for bot users!
 * @returns {EmbedBuider}
 */
class EmbedBuider {
    /**
     * @constructor
     * @description Creates a new EmbedBuilder
     * @returns {this}
     */
    constructor() {
        return this;
    }

    /**
     * @method setTitle
     * @description Sets the title of the Embed
     * @param {string} title - The title of the Embed
     * @returns {this}
     * @throws {Error} - If title is not a string
     */
    setTitle(title) {
        if (typeof title !== 'string') throw new Error('Title must be a string');
        this.title = title;
        return this;
    }

    /**
     * @method setDescription
     * @description Sets the description of the Embed
     * @param {string} content - The description of the Embed
     * @returns {this}
     * @throws {Error} - If content is not a string
     */
    setContent(content) {
        if (typeof content !== 'string') throw new Error('Content must be a string');
        this.description = content;
        return this;
    }

    /**
     * @method setUrl
     * @description Sets the URL of the Embed
     * @param {string} url 
     * @returns {this}
     * @throws {Error} - If url is not a string
     */
    setUrl(url) {
        if (typeof url !== 'string') throw new Error('URL must be a string');
        this.url = url;
        return this;
    }

    /**
     * @method setTimestamp
     * @description Sets the timestamp of the Embed
     * @param {Date} timestamp
     * @returns {this}
     * @throws {Error} - If timestamp is not a Date object
     */
    setTimestamp(timestamp) {
        if (!(typeof timestamp === 'Date')) throw new Error('Timestamp must be a Date object');
        this.timestamp = timestamp;
        return this;
    }

    /**
     * @method setColor
     * @description Sets the color of the Embed
     * @param {Number} color hexadecimal color code 
     * @returns {this}
     * @throws {Error} - If color is not a number
     */
    setColor(color) {
        if (typeof color !== 'number') throw new Error('Color must be a (hex) number');
        this.color = color;
        return this
    }

    /**
     * @method setFooter
     * @description Sets the footer of the Embed
     * @param {string} text - The text of the footer
     * @param {string} [iconUrl] - The URL of the icon
     * @returns {this}
     */
    setFooter(text, iconUrl) {
        this.footer = {
            text: text,
            icon_url: iconUrl
        }
        return this
    }

    /**
     * @method setImage
     * @description Sets the image of the Embed
     * @param {string} url - The URL of the image
     * @returns {this}
     * @throws {Error} - If url is not a string
     */
    setImage(url) {
        if (typeof url !== 'string') throw new Error('URL must be a string');
        this.image = {
            url: url
        }
        return this
    }

    /**
     * @method setThumbnail
     * @description Sets the thumbnail of the Embed
     * @param {string} url - The URL of the thumbnail
     * @returns {this}
     * @throws {Error} - If url is not a string
     */
    setThumbnail(url) {
        this.thumbnail = {
            url: url
        }
        return this
    }

    /**
     * @method setAuthor
     * @description Sets the author of the Embed
     * @param {string} name - The name of the author
     * @param {string} [url] - The URL of the author
     * @param {string} [iconUrl] - The URL of the icon
     * @returns {this}
     * @throws {Error} - If name is not a string
     * @throws {Error} - If url is not a string
     * @throws {Error} - If iconUrl is not a string
     */
    setAuthor(name, url, iconUrl) {
        if (typeof name !== 'string') throw new Error('Name must be a string');
        if (url && typeof url !== 'string') throw new Error('URL must be a string');
        if (iconUrl && typeof iconUrl !== 'string') throw new Error('Icon URL must be a string');
        this.author = {
            name: name,
            url: url,
            icon_url: iconUrl
        }
        return this
    }

    /**
     * @method addField
     * @description Adds a field to the Embed (Note: you can also replicate EmbedField using an array (check EmbedField Properties.))
     * @param {EmbedField} field 
     * @returns {this}
     */
    addField(field) {
        if (!this.fields) this.fields = [];
        this.fields.push(field);
        return this;
    }

    /**
     * @method removeFieldByIndex
     * @description Removes a field from the Embed by index
     * @param {Number} index
     * @returns {this}
     * @throws {Error} - If fields array is empty
     * @throws {Error} - If index out of bounds
     */
    removeFieldByIndex(index) {
        if (!this.fields) throw new Error('Tried to remove a field, but the Field array is empty.');
        if (index < 0 || index >= this.fields.length) throw new Error('Index out of bounds');
        this.fields.splice(index, 1);
        return this;
    }

    /**
     * @method removeFieldByName
     * @description Removes a field from the Embed by name
     * @param {string} name
     * @returns {this}
     * @throws {Error} - If fields array is empty
     * @throws {Error} - If field not found
     */
    removeFieldByName(name) {
        if (!this.fields) throw new Error('Tried to remove a field, but the Field array is empty.');
        if (!this.fields.find(field => field.name === name)) throw new Error('Field not found');
        this.fields = this.fields.filter(field => field.name !== name);
        return this;
    }

    /**
     * @method setFields
     * @description Sets the fields of the Embed
     * @param {Array<EmbedField>} fields
     * @returns {this}
     */
    setFields(fields) {
        if (!Array.isArray(fields)) throw new Error('Fields must be an array');
        if (!fields.every(field => typeof field === 'EmbedField')) throw new Error('Fields must be an array of EmbedFields');
        this.fields = fields;
        return this;
    }
}