export interface ChatMessageVM {
    id: string;
    sender: string;
    content: string;
    isAgent: boolean;
    position: 'left' | 'right';
    timestampFormatted: string;
    isRead: boolean;
    createdAt: string | Date;
    readAt: string | Date | null;
    channel?: string;
    dateLabel?: string;
    showDateSeparator?: boolean;
}

export const CHAT_DATE_FORMATS = {
    TIME_ONLY: 'HH:mm',
    DATE_TIME: 'dd/MM HH:mm',
    FULL: 'dd/MM/yyyy HH:mm:ss',
} as const;
