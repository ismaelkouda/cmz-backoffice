import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';

export interface SlideFindOneProps {
    uniqId: string;
    status: Status;
    order: number;
    timeDuration: number;
    type: string;
    image: string;
    video: string;
    platforms: string[];
    startDate: Date;
    endDate: Date;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
    createdAt: string;
    updatedAt: string;
}
