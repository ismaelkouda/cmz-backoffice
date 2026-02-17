export interface MessagingCreateDto {
    type: string;
    targetType: string;
    region: string;
    department: string;
    municipality: string;
    channels: string[];
    subject: string;
    content: string;
    message: string;
}
