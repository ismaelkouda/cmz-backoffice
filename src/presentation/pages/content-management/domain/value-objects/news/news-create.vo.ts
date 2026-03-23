import { NewsCreateDto } from '@pages/content-management/application/dto/news/news-create.dto';
import { NewsCreateProps } from '@pages/content-management/domain/interfaces/news/news-create-props.interface';

export class NewsCreateVo {
    constructor(private readonly props: NewsCreateProps) {}

    get type(): string {
        return this.props.type;
    }

    get image(): File | null | string {
        return this.props.image;
    }

    get video(): string | null {
        return this.props.video;
    }

    get category(): string {
        return this.props.category;
    }

    get subCategory(): string {
        return this.props.subCategory;
    }

    get hashtags(): string[] {
        return this.props.hashtags;
    }

    get title(): string {
        return this.props.title;
    }

    get resume(): string {
        return this.props.resume;
    }

    get content(): string {
        return this.props.content;
    }

    static fromDto(dto: NewsCreateDto): NewsCreateVo {
        return new NewsCreateVo(dto);
    }
}
