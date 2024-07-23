import { Client, IntentBits, TextChannel, generateNonce } from '../index.js'

(async function() {
    const client = await new Client({ 
        verbose: true, 
        userType: 'bot',
        intents: [IntentBits.Guilds, IntentBits.Direct_Messages, IntentBits.Message_Content, IntentBits.Guild_Messages]
    });
    await client.loginByToken('token')

    await client.on('INTERACTION_CREATE', async (interaction) => {
        console.log(interaction)
        interaction.reply('Pong!')
    })
})();