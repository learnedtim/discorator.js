# discorator.js
The Discord API Wrapper that works for both bots and user accounts.

> [!WARNING]  
> This library is still a work in progress. Only the following classes are implemented:
> * Event Listeners
> * Interactions
> * TextChannels
> * Messages (excluding special elements like Embeds or ActionRows)

## Installing
#### npm
```
npm i discorator.js
```

## Example
You can check the example files in the `testing` directory for more details, however the following shows how one would sign into Discord:
```js
import { Client, IntentBits, TextChannel, generateNonce } from 'discorator.js'

(async function() {
    const client = await new Client({ 
        verbose: true, 
        userType: 'user',
        intents: [IntentBits.Guilds, IntentBits.Direct_Messages, IntentBits.Message_Content, IntentBits.Guild_Messages]
    });
    await client.loginByToken('token') // token login
    // await client.loginByCredentials({email: 'h@h.com', password: 'h', captchaToken: '2captcha-token'}) // credential login (todo: totp support)

    // send command to a channel
    let channel = await new TextChannel(client).fetch('channel_id')
    let res = await channel.emitCommand('ping', 'id')
    
})();
```

## Contribution
We're looking for contributors! Pull requests, Issues, and Documentation updates are all heavily encouraged.

