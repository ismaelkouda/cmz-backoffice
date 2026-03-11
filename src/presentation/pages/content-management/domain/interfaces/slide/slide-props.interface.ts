import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideProps {
    uniqId: string;
    type: string;
    title: string;
    subtitle: string;
    order: number;
    platforms: Platform[];
    status: Status;
    createdAt: string;
    updatedAt: string;
}
