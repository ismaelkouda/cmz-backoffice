import { SlideRequestDto } from "@presentation/pages/content-management/core/application/dtos/slide/slide-request.dto";
import { MediaStatusDto } from "@shared/data/dtos/media-status.dto";

export class SlideFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly type?: Array<string>,
        private readonly status?: MediaStatusDto
    ) { }

    static create(data: SlideRequestDto = {} as SlideRequestDto): SlideFilter {
        return new SlideFilter(
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
