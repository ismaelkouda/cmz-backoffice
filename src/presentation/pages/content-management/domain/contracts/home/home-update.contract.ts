export interface HomeUpdateContract {
    uniqId?: string;
    title?: string;
    resume?: string;
    content?: string;
    image?: File | null | string;
    platforms?: string[];
    startDate?: string;
    endDate?: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
