// this would never work
module.exports = {
    Client: require('./src/client/Client.js'),
    Gateway: require('./src/gateway/Gateway.js'),
    StandardEventListeners: require('./src/gateway/StandardEventListeners.js'),
    ClientInteraction: require('./src/modules/user/ClientInteraction.js'),
    ServerApplicationCommand: require('./src/modules/server/ServerApplicationCommand.js'),
    ServerInteraction: require('./src/modules/server/ServerInteraction.js'),
    Channel: require('./src/modules/shared/Channel.js'),
    Guild: require('./src/modules/shared/Guild.js'),
    Message: require('./src/modules/shared/Message.js'),
    TextChannel: require('./src/modules/shared/TextChannel.js'),
    IntentBitField: require('./src/util/intents.js'),
    EventToIntent: require('./src/util/intents.js'),
    calculateIntentBits: require('./src/util/intents.js'),
    MessageFlags: require('./src/util/MessageFlags.js'),
    registerCommands: require('./src/util/registerCommands.js'),
    Token: require('./src/util/token.js'),
    Nonce: require('./src/util/Nonce.js')
}