export interface SlideUpdateDto {
    uniqId: string;
    timeDuration: number;
    order: number;
    type: string;
    image: File | null | string;
    video: string | null;
    platforms: string[];
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
