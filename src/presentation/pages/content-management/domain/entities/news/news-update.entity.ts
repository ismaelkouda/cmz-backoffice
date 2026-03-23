import { NewsUpdateProps } from '@pages/content-management/domain/interfaces/news/news-update-props.interface';
import { NewsUpdateVo } from '@pages/content-management/domain/value-objects/news/news-update.vo';

export class NewsUpdateEntity {
    constructor(private readonly props: NewsUpdateProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

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

    static fromVo(vo: NewsUpdateVo): NewsUpdateEntity {
        return new NewsUpdateEntity(vo);
    }
}
