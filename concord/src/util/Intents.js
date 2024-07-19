// Intent to Bit mapping
export const IntentBitField = {
    Guilds: 1 << 0,
    Guild_Members: 1 << 1,
    Guild_Moderation: 1 << 2,
    Guild_Emotes_And_Stickers: 1 << 3,
    Guild_Integrations: 1 << 4,
    Guild_Webhooks: 1 << 5,
    Guild_Invites: 1 << 6,
    Guild_Voice_States: 1 << 7,
    Guild_Presences: 1 << 8,
    Guild_Messages: 1 << 9,
    Guild_Message_Reactions: 1 << 10,
    Guild_Message_Typing: 1 << 11,
    Direct_Messages: 1 << 12,
    Direct_Message_Reactions: 1 << 13,
    Direct_Message_Typing: 1 << 14,
    Message_Content: 1 << 15,
    Guild_Scheduled_Events: 1 << 16,
    Auto_Moderation_Configuration: 1 << 20,
    Auto_Moderation_Execution: 1 << 21,
    Guild_Message_Polls: 1 << 24,
    Direct_Message_Polls: 1 << 25
}

// Event Name to Intent mapping (why? Ensure error catching when adding an event listener that would never fire)
// NOTE: when implementing, reminder some entries appear multiple times for different intents
// NOTE: Not all events have a corresponding intent; these are not included of course.
export const EventToIntent = {
    'GUILD_CREATE': 'Guilds',
    'GUILD_UPDATE': 'Guilds',
    'GUILD_DELETE': 'Guilds',
    'GUILD_ROLE_CREATE': 'Guilds',
    'GUILD_ROLE_UPDATE': 'Guilds',
    'GUILD_ROLE_DELETE': 'Guilds',
    'CHANNEL_CREATE': 'Guilds',
    'CHANNEL_UPDATE': 'Guilds',
    'CHANNEL_DELETE': 'Guilds',
    'CHANNEL_PINS_UPDATE': 'Guilds',
    'THREAD_CREATE': 'Guilds',
    'THREAD_UPDATE': 'Guilds',
    'THREAD_DELETE': 'Guilds',
    'THREAD_LIST_SYNC': 'Guilds',
    'THREAD_MEMBER_UPDATE': 'Guilds',
    'THREAD_MEMBERS_UPDATE': 'Guilds',
    'STAGE_INSTANCE_CREATE': 'Guilds',
    'STAGE_INSTANCE_UPDATE': 'Guilds',
    'STAGE_INSTANCE_DELETE': 'Guilds',
    'GUILD_MEMBER_ADD': 'Guild_Members',
    'GUILD_MEMBER_UPDATE': 'Guild_Members',
    'GUILD_MEMBER_REMOVE': 'Guild_Members',
    'THREAD_MEMBERS_UPDATE': 'Guild_Members',
    'GUILD_AUDIT_LOG_ENTRY_CREATE': 'Guild_Moderation',
    'GUILD_BAN_ADD': 'Guild_Moderation',
    'GUILD_BAN_REMOVE': 'Guild_Moderation',
    'GUILD_EMOJIS_UPDATE': 'Guild_Emotes_And_Stickers',
    'GUILD_STICKERS_UPDATE': 'Guild_Emotes_And_Stickers',
    'GUILD_INTEGRATIONS_UPDATE': 'Guild_Integrations',
    'INTEGRATION_CREATE': 'Guild_Integrations',
    'INTEGRATION_UPDATE': 'Guild_Integrations',
    'INTEGRATION_DELETE': 'Guild_Integrations',
    'WEBHOOKS_UPDATE': 'Guild_Webhooks',
    'INVITE_CREATE': 'Guild_Invites',
    'INVITE_DELETE': 'Guild_Invites',
    'VOICE_STATE_UPDATE': 'Guild_Voice_States',
    'PRESENCE_UPDATE': 'Guild_Presences',
    'MESSAGE_CREATE': 'Guild_Messages',
    'MESSAGE_UPDATE': 'Guild_Messages',
    'MESSAGE_DELETE': 'Guild_Messages',
    'MESSAGE_DELETE_BULK': 'Guild_Messages',
    'MESSAGE_REACTION_ADD': 'Guild_Message_Reactions',
    'MESSAGE_REACTION_REMOVE': 'Guild_Message_Reactions',
    'MESSAGE_REACTION_REMOVE_ALL': 'Guild_Message_Reactions',
    'MESSAGE_REACTION_REMOVE_EMOJI': 'Guild_Message_Reactions',
    'TYPING_START': 'Guild_Message_Typing',
    'MESSAGE_CREATE': 'Direct_Messages',
    'MESSAGE_UPDATE': 'Direct_Messages',
    'MESSAGE_DELETE': 'Direct_Messages',
    'CHANNEL_PINS_UPDATE': 'Direct_Messages',
    'MESSAGE_REACTION_ADD': 'Direct_Message_Reactions',
    'MESSAGE_REACTION_REMOVE': 'Direct_Message_Reactions',
    'MESSAGE_REACTION_REMOVE_ALL': 'Direct_Message_Reactions',
    'MESSAGE_REACTION_REMOVE_EMOJI': 'Direct_Message_Reactions',
    'TYPING_START': 'Direct_Message_Typing',
    'MESSAGE_POLL_VOTE_ADD': 'Guild_Message_Polls',
    'MESSAGE_POLL_VOTE_REMOVE': 'Guild_Message_Polls',
    'MESSAGE_POLL_VOTE_ADD': 'Direct_Message_Polls',
    'MESSAGE_POLL_VOTE_REMOVE': 'Direct_Message_Polls',
    'MESSAGE_POLL_VOTE_REMOVE': 'Message_Content',
    'GUILD_SCHEDULED_EVENT_CREATE': 'Guild_Scheduled_Events',
    'GUILD_SCHEDULED_EVENT_UPDATE': 'Guild_Scheduled_Events',
    'GUILD_SCHEDULED_EVENT_DELETE': 'Guild_Scheduled_Events',
    'GUILD_SCHEDULED_EVENT_USER_ADD': 'Guild_Scheduled_Events',
    'GUILD_SCHEDULED_EVENT_USER_REMOVE': 'Guild_Scheduled_Events',
    'AUTO_MODERATION_RULE_CREATE': 'Auto_Moderation_Configuration',
    'AUTO_MODERATION_RULE_UPDATE': 'Auto_Moderation_Configuration',
    'AUTO_MODERATION_RULE_DELETE': 'Auto_Moderation_Configuration',
    'AUTO_MODERATION_ACTION_EXECUTION': 'Auto_Moderation_Execution',
    'MESSAGE_POLL_VOTE_ADD': 'Guild_Message_Polls',
    'MESSAGE_POLL_VOTE_REMOVE': 'Guild_Message_Polls',
    'MESSAGE_POLL_VOTE_ADD': 'Direct_Message_Polls',
    'MESSAGE_POLL_VOTE_REMOVE': 'Direct_Message_Polls' 

}

/**
 * Calculates the binary value of the intent to be sent to the server
 * @param {Array} intents 
 * @returns {Number} The binary value of the intent
 */
export async function calculateIntentBits(intents) {
    if (!typeof intents === 'object') throw new Error('Intents must be an array of intent bits')

    let combined = 0
    for (const intent of intents) {
        combined |= intent
    }

    //console.log(combined)

    return combined
}

export default IntentBitField