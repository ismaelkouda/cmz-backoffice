import { Platform } from '@shared/domain/enums/platform.enum';

import { HomeFilterDto } from '@presentation/pages/content-management/application/dto/home/home-filter.dto';
import { Status } from '@presentation/pages/content-management/domain/enums/home/home-status.enum';

export class HomeFilterVo {
    public readonly search?: string;
    public readonly platforms?: Platform[];
    public readonly status?: Status;
    public readonly startDate?: string;
    public readonly endDate?: string;

    constructor(props: {
        search?: string;
        platforms?: Platform[];
        status?: Status;
        startDate?: string;
        endDate?: string;
    }) {
        this.search = props.search;
        this.platforms = props.platforms;
        this.status = props.status;
        this.startDate = props.startDate;
        this.endDate = props.endDate;
    }

    static fromDto(
        dto: HomeFilterDto | null = {} as HomeFilterDto
    ): HomeFilterVo {
        return new HomeFilterVo({
            search: dto?.search?.trim() || undefined,
            platforms: dto?.platforms,
            status: dto?.status,
            startDate: dto?.startDate,
            endDate: dto?.endDate,
        });
    }
}
