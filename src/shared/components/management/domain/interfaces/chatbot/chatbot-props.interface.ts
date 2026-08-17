import { Channels } from '@shared/components/management/domain/enums/chatbot/chatbot-channels.enum';
export interface ChatbotProps {
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
    updatedAt: string;
}
