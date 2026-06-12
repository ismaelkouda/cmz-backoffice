import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideProps } from '@pages/content-management/domain/interfaces/slide/slide-props.interface';
import { Platform, PlatformStyle } from '@shared/domain/enums/platform.enum';

export class SlideEntity {
    constructor(private readonly props: SlideProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get actionsRef(): string {
        return this.props.title.trim().slice(0, 15);
    }
    get platforms(): Platform[] {
        return this.props.platforms;
    }
    platformsStyle(platform: Platform): PlatformStyle {
        const methodMap: Record<Platform, PlatformStyle> = {
            [Platform.MOBILE]: PlatformStyle.MOBILE,
            [Platform.WEB]: PlatformStyle.WEB,
            [Platform.PWA]: PlatformStyle.PWA,
        };
        return methodMap[platform];
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
    get order(): number {
        return this.props.order;
    }
    get status(): Status {
        return this.props.status;
    }
    statusStyle(status: Status): StatusStyle {
        const methodMap: Record<Status, StatusStyle> = {
            [Status.ACTIVE]: StatusStyle.ACTIVE,
            [Status.INACTIVE]: StatusStyle.INACTIVE,
        };
        return methodMap[status];
    }
    get createdAt(): string {
        return this.props.createdAt;
    }
    get updatedAt(): string {
        return this.props.updatedAt;
    }

    public with(props: SlideProps): SlideEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new SlideEntity(props);
    }

    toJSON(): SlideProps {
        return { ...this.props };
    }
}
