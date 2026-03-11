import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideFindOneProps } from '@pages/content-management/domain/interfaces/slide/slide-find-one-props.interface';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideFindOneEntity {
    constructor(private readonly props: SlideFindOneProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get platforms(): Platform[] {
        return this.props.platforms;
    }
    get type(): string {
        return this.props.type;
    }
    get title(): string {
        return this.props.title;
    }
    get subtitle(): string {
        return this.props.subtitle;
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
    get timeDuration(): number {
        return this.props.timeDuration;
    }
    get order(): number {
        return this.props.order;
    }
    get buttonLabel(): string | undefined {
        return this.props.buttonLabel;
    }
    get buttonUrl(): string | undefined {
        return this.props.buttonUrl;
    }
    get status(): Status {
        return this.props.status;
    }
    get startDate(): string {
        return this.props.startDate;
    }
    get endDate(): string {
        return this.props.endDate;
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: SlideFindOneProps): SlideFindOneEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new SlideFindOneEntity(props);
    }

    toJSON(): SlideFindOneProps {
        return { ...this.props };
    }
}
