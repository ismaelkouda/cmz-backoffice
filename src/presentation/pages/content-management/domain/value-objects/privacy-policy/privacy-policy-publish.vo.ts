import { PrivacyPolicyPublishDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-publish.dto';

export class PrivacyPolicyPublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: PrivacyPolicyPublishDto): PrivacyPolicyPublishVo {
        return new PrivacyPolicyPublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
