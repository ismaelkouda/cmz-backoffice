import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';
import { NewsFindOneProps } from '@pages/content-management/domain/interfaces/news/news-find-one-props.interface';

export class NewsFindOneEntity {
    constructor(private readonly props: NewsFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get hashtags(): string[] {
        return this.props.hashtags;
    }
    get type(): string {
        return this.props.type;
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
    get image(): string {
        return this.props.image;
    }
    get video(): string {
        return this.props.video;
    }
    get order(): number {
        return this.props.order;
    }
    get category(): string {
        return this.props.category;
    }
    get subCategory(): string {
        return this.props.subCategory;
    }
    get status(): Status {
        return this.props.status;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: NewsFindOneProps): NewsFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new NewsFindOneEntity(props);
    }

    toJSON(): NewsFindOneProps {
        return { ...this.props };
    }
}
