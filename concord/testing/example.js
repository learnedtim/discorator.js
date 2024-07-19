import { Client, IntentBits, TextChannel, generateNonce } from '../index.js'

(async function() {
    const client = await new Client({ 
        verbose: true, 
        userType: 'user',
        intents: [IntentBits.Guilds, IntentBits.Direct_Messages, IntentBits.Message_Content, IntentBits.Guild_Messages]
    });
    await client.loginByToken('token')

    // send command to a channel
    let channel = await new TextChannel(client).fetch('channel_id')
    let res = await channel.emitCommand('ping', 'id')
    
})();