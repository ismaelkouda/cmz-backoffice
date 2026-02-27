import { PrivacyPolicyFindOneFilterDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-find-one-filter.dto';

export class PrivacyPolicyFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: PrivacyPolicyFindOneFilterDto
    ): PrivacyPolicyFindOneFilterVo {
        return new PrivacyPolicyFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
