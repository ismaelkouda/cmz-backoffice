export interface NewsUpdateApiDto {
    id: string;
    type: string;
    image_file: File | string;
    video_url: string;
    category: string;
    sub_category: string;
    hashtags: string[];
    title: string;
    resume: string;
    content: string;
}
