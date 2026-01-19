import { HomeRequestDto } from '@presentation/pages/content-management/core/application/dtos/home/home-request.dto';
import { MediaStatusDto } from '@shared/data/dtos/media-status.dto';

export class HomeFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly platforms?: Array<string>,
        private readonly search?: string,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: HomeRequestDto = {} as HomeRequestDto): HomeFilter {
        return new HomeFilter(
            data.startDate,
            data.endDate,
            data.platforms,
            data.search,
            data.status
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.platforms && this.platforms?.length > 0) params['platforms'] = this.platforms;
        if (this.search) params['search'] = this.search;
        if (this.status !== undefined) params['status'] = this.status;

        return params;
    }
}
