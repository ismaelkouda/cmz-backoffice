import { TermsUseRequestDto } from "../../application/dtos/terms-use/terms-use-request.dto";

export class TermsUseFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(data: TermsUseRequestDto = {} as TermsUseRequestDto): TermsUseFilter {
        return new TermsUseFilter(
            data.createdFrom,
            data.createdTo,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.createdFrom)
            params['created_from'] = this.createdFrom;
        if (this.createdTo) params['created_to'] = this.createdTo;
        if (this.isPublished) params['isPublished'] = this.isPublished;

        return params;
    }
}
