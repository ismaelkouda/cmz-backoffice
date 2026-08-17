export interface NewsUpdateApiDto {
    id: string;
    type: string;
    image_file: File | string;
    video_url: string;
    category_id: string;
    sub_category_id: string;
    hashtags: string[];
    title: string;
    resume: string;
    content: string;
}
