/**
 * @see https://discord.com/developers/docs/topics/gateway#list-of-intents List of all Intents
 */
export enum Intent {
    /**
     * Required for event:
     * - GuildCreate
     * - GuildUpdate
     * - GuildDelete
     * - GuildRoleCreate
     * - GuildRoleUpdate
     * - GuildRoleDelete
     * - ChannelCreate
     * - ChannelUpdate
     * - ChannelDelete
     * - ChannelPinsUpdate
     * - ThreadCreate
     * - ThreadUpdate
     * - ThreadDelete
     * - ThreadListSync
     * - ThreadMemberUpdate
     * - ThreadMembersUpdate (contains different data depending on which intents are used)
     * - StageInstanceCreate
     * - StageInstanceUpdate
     * - StageInstanceDelete
     */
    Guilds = 1,

    /**
     * Required for event:
     * - GuildMemberAdd
     * - GuildMemberUpdate
     * - GuildMemberRemove
     * - ThreadMembersUpdate (contains different data depending on which intents are used)
     */
    GuildMembers = 2,

    /**
     * Required for event:
     * - GuildAuditLogEntryCreate
     * - GuildBanAdd
     * - GuildBanRemove
     */
    GuildModeration = 4,

    /**
     * Required for event:
     * - GuildEmojisUpdate
     * - GuildStickersUpdate
     */
    GuildEmojisAndStickers = 8,

    /**
     * Required for event:
     * - GuildIntegrationsUpdate
     * - IntegrationCreate
     * - IntegrationUpdate
     * - IntegrationDelete
     */
    GuildIntegrations = 16,

    /**
     * Required for event:
     * - WebhooksUpdate
     */
    GuildWebhooks = 32,

    /**
     * Required for event:
     * - InviteCreate
     * - InviteDelete
     */
    GuildInvites = 64,

    /**
     * Required for event:
     * - VoiceStateUpdate
     */
    GuildVoiceStates = 128,

    /**
     * Required for event:
     * - PresenceUpdate
     */
    GuildPresences = 256,

    /**
     * Required for event:
     * - MessageCreate
     * - MessageUpdate
     * - MessageDelete
     * - MessageDeleteBulk
     */
    GuildMessages = 512,

    /**
     * Required for event:
     * - MessageReactionAdd
     * - MessageReactionRemove
     * - MessageReactionRemoveAll
     * - MessageReactionRemoveEmoji
     */
    GuildMessageReactions = 1024,

    /**
     * Required for event:
     * - TypingStart
     */
    GuildMessageTyping = 2048,

    /**
     * Required for event:
     * - MessageCreate
     * - MessageUpdate
     * - MessageDelete
     * - ChannelPinsUpdate
     */
    DirectMessages = 4096,

    /**
     * Required for event:
     * - MessageReactionAdd
     * - MessageReactionRemove
     * - MessageReactionRemoveAll
     * - MessageReactionRemoveEmoji
     */
    DirectMessageReactions = 8192,

    /**
     * Required for event:
     * - TypingStart
     */
    DirectMessageTyping = 16384,

    /**
     * MessageContent does not represent individual events, but rather affects what data is present for events
     * that could contain message content fields. More information is in the message content intent section.
     */
    MessageContent = 32768,

    /**
     * Required for event:
     * - GuildScheduledEventCreate
     * - GuildScheduledEventUpdate
     * - GuildScheduledEventDelete
     * - GuildScheduledEventUserAdd
     * - GuildScheduledEventUserRemove
     */
    GuildScheduledEvents = 65536,

    /**
     * Required for event:
     * - AutoModerationRuleCreate
     * - AutoModerationRuleUpdate
     * - AutoModerationRuleDelete
     */
    AutoModerationConfiguration = 1048576,

    /**
     * Required for event:
     * - AutoModerationActionExecution
     */
    AutoModerationExecution = 2097152,

    /**
     * Required for event:
     * - MessagePollVoteAdd
     * - MessagePollVoteRemove
     */
    GuildMessagePolls = 16777216,

    /**
     * Required for event:
     * - MessagePollVoteAdd
     * - MessagePollVoteRemove
     */
    DirectMessagePolls = 33554432
}

export const AutomaticIntents: never[] = [];