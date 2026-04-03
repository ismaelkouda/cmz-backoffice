export interface ChatbotCreateDto {
    reportId: string;
    type: string;
    targetType: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
}
