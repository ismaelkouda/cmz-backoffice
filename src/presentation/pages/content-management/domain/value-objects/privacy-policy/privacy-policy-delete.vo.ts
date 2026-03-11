import { PrivacyPolicyDeleteDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-delete.dto';

export class PrivacyPolicyDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: PrivacyPolicyDeleteDto): PrivacyPolicyDeleteVo {
        return new PrivacyPolicyDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
