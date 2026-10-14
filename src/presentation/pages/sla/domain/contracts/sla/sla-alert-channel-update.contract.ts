export interface SlaAlertChannelUpdateContract {
    contacts: {
        escalationContactId: string;
        channels: {
            channelId: string;
            enabled: boolean;
        }[];
    }[];
}
