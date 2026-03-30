import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/home/home-status.enum';
import { HomeProps } from '@pages/content-management/domain/interfaces/home/home-props.interface';
import { Platform, PlatformStyle } from '@shared/domain/enums/platform.enum';

export class HomeEntity {
    constructor(private readonly props: HomeProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }
    get actionsRef(): string {
        return this.props.uniqId;
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
    get title(): string {
        return this.props.title;
    }
    get resume(): string {
        return this.props.resume;
    }
    get image(): string {
        return this.props.image;
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

    public with(props: HomeProps): HomeEntity {
        if (
            this.updatedAt === props.updatedAt &&
            this.uniqId === props.uniqId
        ) {
            return this;
        }
        return new HomeEntity(props);
    }

    toJSON(): HomeProps {
        return { ...this.props };
    }
}
