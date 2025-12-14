import { HomeRequestDto } from "@presentation/pages/content-management/core/application/dtos/home/home-request.dto";
import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";

export class HomeFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly type?: Array<string>,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: HomeRequestDto = {} as HomeRequestDto): HomeFilter {
        return new HomeFilter(
            data.createdFrom,
            data.createdTo,
            data.type,
            data.status
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.createdFrom)
            params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.type) params['type'] = this.type;
        if (this.status) params['status'] = this.status;

        return params;
    }
}
