import { Client, IntentBits, TextChannel, generateNonce } from '../discorator/index.js'

(async function() {
    const client = await new Client({ 
        verbose: true, 
        userType: 'bot',
        intents: [IntentBits.Guilds, IntentBits.Direct_Messages, IntentBits.Message_Content, IntentBits.Guild_Messages]
    });
    client.loginByToken('token')

    await client.on('INTERACTION_CREATE', async (interaction) => {
        console.log(interaction)
        await interaction.reply('Pong!')
    })
})();