/**
 * ApplicationCommand body constructor (adding)
 * To delete a command, use {}
 */
export default class ApplicationCommand {
    constructor() {
    }

    /**
     * Add a command to the application
     * @param {ApplicationCommand} command -- command to add
     */
    addSubCommand() {
        // ensure not nesting another command or group
    }

    /**
     * Add a command group to the application
     * @param {SubCommandGroup} commandGroup -- command group to add
     */
    addSubCommandGroup() {
        // ensure not nesting another group
    }


}

export class SubCommand {

}

export class SubCommandGroup {

}

export class CommandBaseOption {

}

export class CommandStringOption extends CommandBaseOption {

}

export class CommandIntegerOption extends CommandBaseOption {

}

export class CommandBooleanOption extends CommandBaseOption {

}

export class CommandUserOption extends CommandBaseOption {

}

export class CommandChannelOption extends CommandBaseOption {

}

export class CommandRoleOption extends CommandBaseOption {

}

export class CommandMentionableOption extends CommandBaseOption {

}

export class CommandNumberOption extends CommandBaseOption {

}

export class CommandAttachmentOption extends CommandBaseOption {

}

/**
 * Delete a command
 * @param {Id} id -- id of the command
 */
export function deleteCommand() {

}