import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { SlideFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-filter.vo';
import { Platform } from '@shared/domain/enums/platform.enum';

export class SlideFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly platforms?: Platform[],
        public readonly status?: Status,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: SlideFilterVo): SlideFilterEntity {
        return new SlideFilterEntity(
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
