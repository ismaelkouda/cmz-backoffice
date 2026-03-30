import {
    Status,
    StatusStyle,
} from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform, PlatformStyle } from '@shared/domain/enums/platform.enum';

export interface SlideVmProps {
    uniqId: string;
    type: string;
    title: string;
    subtitle: string;
    platforms: Platform[];
    platformsStyle: (platform: Platform) => PlatformStyle;
    status: Status;
    statusLabel: string;
    statusStyle: StatusStyle;
    createdAt: string;
    actionsRef: string;
}
