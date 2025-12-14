import { PrivacyPolicyRequestDto } from "../../application/dtos/privacy-policy/privacy-policy-request.dto";

export class PrivacyPolicyFilter {
    private constructor(
        private readonly createdFrom?: string,
        private readonly createdTo?: string,
        private readonly isPublished?: boolean
    ) { }

    static create(data: PrivacyPolicyRequestDto = {} as PrivacyPolicyRequestDto): PrivacyPolicyFilter {
        return new PrivacyPolicyFilter(
            data.createdFrom,
            data.createdTo,
            data.isPublished
        );
    }

    toDto(): any {
        const params: any = {};

        if (this.createdFrom) params['createdFrom'] = this.createdFrom;
        if (this.createdTo) params['createdTo'] = this.createdTo;
        if (this.isPublished) params['isPublished'] = this.isPublished;

        return params;
    }
}
