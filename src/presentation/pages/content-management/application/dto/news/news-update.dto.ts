export interface NewsUpdateDto {
    uniqId: string;
    type: string;
    image: File | null | string;
    video: string | null;
    category: string;
    subCategory: string;
    hashtags: string[];
    title: string;
    resume: string;
    content: string;
}
