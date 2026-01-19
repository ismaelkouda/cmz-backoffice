import { SlideRequestDto } from '@presentation/pages/content-management/core/application/dtos/slide/slide-request.dto';
import { MediaStatusDto } from '@shared/data/dtos/media-status.dto';

export class SlideFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly platforms?: Array<string>,
        private readonly search?: string,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: SlideRequestDto = {} as SlideRequestDto): SlideFilter {
        return new SlideFilter(
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
