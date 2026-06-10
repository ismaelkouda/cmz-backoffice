import { Status } from '@pages/content-management/domain/enums/home/home-status.enum';

export interface HomeFindOneProps {
    uniqId: string;
    title: string;
    resume: string;
    order: number;
    platforms: string[];
    status: Status;
    content: string;
    image: string;
    timeDurationInSeconds: number;
    buttonLabel: string;
    buttonUrl: string;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}
