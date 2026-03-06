import { Platform } from '@shared/domain/enums/platform.enum';

import { Status } from '@presentation/pages/content-management/domain/enums/home/home-status.enum';

export interface HomeProps {
    uniqId: string;
    title: string;
    resume: string;
    image: string;
    order: number;
    platforms: Platform[];
    status: Status;
    createdAt: string;
    updatedAt: string;
}
