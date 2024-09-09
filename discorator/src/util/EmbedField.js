/**
 * @class EmbedField
 * @description Represents a field in an Embed
 * @prop {string} name The name of the field
 * @prop {string} value The value of the field
 * @prop {boolean} inline Whether the field is inline
 */
class EmbedField {
    /**
     * @constructor
     * @param {string} [name] 
     * @param {string} [value]
     * @param {boolean} [inline] 
     */
    constructor(name, value, inline) {
        this.name = name;
        this.value = value;
        this.inline = inline;
    }

    /**
     * @method setName
     * @description Sets the name of the field
     * @param {string} name - The name of the field
     * @returns {this}
     * @throws {Error} - If name is not a string
     */
    setName(name) {
        if (typeof name !== 'string') throw new Error('Name must be a string');
        this.name = name;
        return this
    }

    /**
     * @method setValue
     * @description Sets the value of the field
     * @param {string} value - The value of the field
     * @returns {this}
     * @throws {Error} - If value is not a string
     */
    setValue(value) {
        if (typeof value !== 'string') throw new Error('Value must be a string');
        this.value = value;
        return this
    }

    /**
     * @method setInline
     * @description Sets the inline of the field
     * @param {boolean} inline - The inline of the field
     * @returns {this}
     * @throws {Error} - If inline is not a boolean
     */
    setInline(inline) {
        if (typeof inline !== 'boolean') throw new Error('Inline must be a boolean');
        this.inline = inline;
        return this
    }
}