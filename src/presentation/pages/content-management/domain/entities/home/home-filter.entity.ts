import { Platform } from '@shared/domain/enums/platform.enum';

import { Status } from '@presentation/pages/content-management/domain/enums/home/home-status.enum';
import { HomeFilterVo } from '@presentation/pages/content-management/domain/value-objects/home/home-filter.vo';

export class HomeFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly platforms?: Platform[],
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: HomeFilterVo): HomeFilterEntity {
        return new HomeFilterEntity(
            vo.search,
            vo.platforms,
            vo.status,
            vo.startDate,
            vo.endDate
        );
    }

    describe(): string {
        return JSON.stringify({
            search: this.search,
            platforms: this.platforms,
            status: this.status,
        });
    }
}
