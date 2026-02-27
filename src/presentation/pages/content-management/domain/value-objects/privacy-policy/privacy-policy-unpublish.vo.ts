import { PrivacyPolicyUnpublishDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-unpublish.dto';

export class PrivacyPolicyUnpublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: PrivacyPolicyUnpublishDto): PrivacyPolicyUnpublishVo {
        return new PrivacyPolicyUnpublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
