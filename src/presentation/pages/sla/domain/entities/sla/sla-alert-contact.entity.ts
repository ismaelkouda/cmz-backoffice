export interface SlaAlertChannelEntity {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
}

export interface SlaAlertContactEntity {
    id: string;
    type: string;
    channels: SlaAlertChannelEntity[];
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    telegram: boolean;
}
