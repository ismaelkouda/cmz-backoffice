import { LegalNoticeRequestDto } from "../../application/dtos/legal-notice/legal-notice-request.dto";

export class LegalNoticeFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(data: LegalNoticeRequestDto = {} as LegalNoticeRequestDto): LegalNoticeFilter {
        return new LegalNoticeFilter(
            data.createdFrom,
            data.createdTo,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.createdFrom) params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.isPublished) params['is_published'] = this.isPublished;

        return params;
    }
}
