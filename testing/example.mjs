import { Client, IntentBits, TextChannel, generateNonce } from '../discorator/index.js'

(async function() {
    const client = await new Client({ 
        verbose: true, 
        userType: 'user',
        intents: [IntentBits.Guilds, IntentBits.Direct_Messages, IntentBits.Message_Content, IntentBits.Guild_Messages]
    });
    await client.loginByToken('token')

    // send command to a channel
    //let channel = await new TextChannel(client).fetch('1004309859669381131')
    //console.log(channel)
    //let res = await channel.send('Hello!')
    
    client.on('MESSAGE_CREATE', async (message) => {
        console.log(`${message.author.username}: ${message.content}`)
    })
})(); 