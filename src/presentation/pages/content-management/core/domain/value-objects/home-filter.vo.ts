import { HomeRequestDto } from "@presentation/pages/content-management/core/application/dtos/home/home-request.dto";
import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";

export class HomeFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly plateforms?: Array<string>,
        private readonly search?: string,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: HomeRequestDto = {} as HomeRequestDto): HomeFilter {
        return new HomeFilter(
            data.startDate,
            data.endDate,
            data.plateforms,
            data.search,
            data.status
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate)
            params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.plateforms) params['plateforms'] = this.plateforms;
        if (this.search) params['search'] = this.search;
        if (this.status) params['status'] = this.status;

        return params;
    }
}
