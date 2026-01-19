export interface NewsFilterPayloadEntity {
    startDate: string;
    endDate: string;
    search: string;
    isPublished?: boolean | null;
}
