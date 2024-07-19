export const MessageFlags = {
    Crossposted: 1 << 0,
    IsCrosspost: 1 << 1,
    SupressEmbeds: 1 << 2,
    SourceMessageDeleted: 1 << 3,
    Urgent: 1 << 4,
    HasThread: 1 << 5,
    Ephemeral: 1 << 6,
    Loading: 1 << 7,
    FailedToMentionSomeRolesInThread: 1 << 8,
    Supress_Notifications: 1 << 12,
    IsVoiceMessage: 1 << 14,
}
export default MessageFlags