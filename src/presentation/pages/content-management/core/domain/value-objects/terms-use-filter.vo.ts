import { TermsUseRequestDto } from '../../application/dtos/terms-use/terms-use-request.dto';

export class TermsUseFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly version?: string,
        private readonly search?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(
        data: TermsUseRequestDto = {} as TermsUseRequestDto
    ): TermsUseFilter {
        return new TermsUseFilter(
            data.startDate,
            data.endDate,
            data.version,
            data.search,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.startDate) params['startDate'] = this.startDate;
        if (this.endDate) params['endDate'] = this.endDate;
        if (this.version) params['version'] = this.version;
        if (this.search) params['search'] = this.search;
        if (this.isPublished !== undefined) params['is_published'] = this.isPublished;

        return params;
    }
}
