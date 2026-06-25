import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/news/news-status.enum';
import { NewsProps } from '@pages/content-management/domain/interfaces/news/news-props.interface';

export class NewsEntity {
    constructor(private readonly props: NewsProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get actionsRef(): string {
        return this.props.title.trim().slice(0, 15);
    }
    get type(): string {
        return this.props.type;
    }
    get title(): string {
        return this.props.title;
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
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.PUBLISH]: StatusStyle.PUBLISH,
            [Status.UNPUBLISH]: StatusStyle.UNPUBLISH,
        };
        return methodMap[status];
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: NewsProps): NewsEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new NewsEntity(props);
    }

    toJSON(): NewsProps {
        return { ...this.props };
    }
}
