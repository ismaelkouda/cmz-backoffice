export interface SlaAlertChannelApiDto {
    id: string;
    code: string;
    name: string;
    enabled: boolean;
}

export interface SlaAlertContactItemApiDto {
    id: string;
    type: string;
    channels: SlaAlertChannelApiDto[];
}

export interface SlaAlertContactsResponseApiDto {
    error: boolean;
    message: string;
    data: SlaAlertContactItemApiDto[];
}

export interface SlaAlertChannelOptionApiDto {
    id: string;
    name: string;
}

export interface SlaAlertChannelOptionsResponseApiDto {
    error: boolean;
    message: string;
    data: SlaAlertChannelOptionApiDto[];
}

export interface SlaAlertChannelUpdateDto {
    channel_id: string;
    enabled: boolean;
}

export interface SlaAlertContactUpdateDto {
    escalation_contact_id: string;
    channels: SlaAlertChannelUpdateDto[];
}

export interface SlaAlertUpdatePayloadApiDto {
    contacts: SlaAlertContactUpdateDto[];
}
