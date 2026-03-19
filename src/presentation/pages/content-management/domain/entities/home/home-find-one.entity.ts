import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';
import { HomeFindOneProps } from '@pages/content-management/domain/interfaces/home/home-find-one-props.interface';

export class HomeFindOneEntity {
    constructor(private readonly props: HomeFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get platforms(): string[] {
        return this.props.platforms;
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
    get timeDurationInSeconds(): number {
        return this.props.timeDurationInSeconds;
    }
    get order(): number {
        return this.props.order;
    }
    get buttonLabel(): string {
        return this.props.buttonLabel;
    }
    get buttonUrl(): string {
        return this.props.buttonUrl;
    }
    get status(): Status {
        return this.props.status;
    }
    get startDate(): Date {
        return this.props.startDate;
    }
    get endDate(): Date {
        return this.props.endDate;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: HomeFindOneProps): HomeFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new HomeFindOneEntity(props);
    }

    toJSON(): HomeFindOneProps {
        return { ...this.props };
    }
}
