import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsFindOneItemApiDto {
    id: string;
    type: string;
    title: string;
    resume: string;
    image_url: string;
    video_url: string;
    order: number;
    hashtags: string[];
    content: string;
    category: string;
    sub_category: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type NewsFindOneResponseApiDto =
    SimpleResponseDto<NewsFindOneItemApiDto>;
