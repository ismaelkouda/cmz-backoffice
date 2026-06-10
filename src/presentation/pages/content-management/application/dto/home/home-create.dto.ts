export interface HomeCreateDto {
    image: File | null | string;
    platforms: string[];
    startDate: string;
    endDate: string;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
