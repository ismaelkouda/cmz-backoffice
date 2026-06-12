export interface NewsCreateApiDto {
    type: string;
    image_file: File | string;
    video_url: string;
    category_id: string;
    sub_category: string;
    hashtags: string[];
    title: string;
    resume: string;
    content: string;
}
