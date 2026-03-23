export interface NewsCreateProps {
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
