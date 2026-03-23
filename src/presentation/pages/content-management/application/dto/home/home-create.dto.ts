export interface HomeCreateDto {
    image: File | null | string;
    platforms: string[];
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
