class Interaction {
    constructor(client) {
        this.client = client;
    }

}

export default class SlashCommandInteraction extends Interaction {
    constructor(client) {
        super(client);
    }


}