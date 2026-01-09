import { LegalNoticeRequestDto } from '../../application/dtos/legal-notice/legal-notice-request.dto';

export class LegalNoticeFilter {
    private constructor(
        private readonly startDate?: string,
        private readonly endDate?: string,
        private readonly version?: string,
        private readonly search?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(
        data: LegalNoticeRequestDto = {} as LegalNoticeRequestDto
    ): LegalNoticeFilter {
        return new LegalNoticeFilter(
            data.startDate,
            data.endDate,
            data.version,
            data.search,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};
        console.log("this.isPublished", this.isPublished)
        if (this.startDate) params['start_date'] = this.startDate;
        if (this.endDate) params['end_date'] = this.endDate;
        if (this.version) params['version'] = this.version;
        if (this.search) params['search'] = this.search;
        if (this.isPublished !== undefined) params['is_published'] = this.isPublished;

        return params;
    }
}
