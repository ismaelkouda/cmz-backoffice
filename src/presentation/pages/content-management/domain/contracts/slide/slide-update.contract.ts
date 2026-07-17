export interface SlideUpdateContract {
    uniqId?: string;
    timeDuration?: number;
    type?: string;
    image?: File | null | string;
    video?: string | null;
    platforms?: string[];
    startDate?: string;
    endDate?: string;
    title?: string;
    subtitle?: string;
    content?: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
