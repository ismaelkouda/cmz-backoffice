import { Channels } from '@pages/communication/domain/enums/messaging/messaging-channels.enum';
export interface MessagingProps {
    uniqId: string;
    reportId: string;
    type: string;
    targetType: string;
    region: string;
    department: string;
    municipality: string;
    channels: Channels[];
    subject: string;
    content: string;
    createdAt: string;
}
