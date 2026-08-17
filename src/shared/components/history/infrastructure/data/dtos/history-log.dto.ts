export interface HistoryLogDto {
    uniqId: string;
    action: string;
    module: string;
    description: string;
    user: string;
    createdAt: string;
    details?: any[];
}
