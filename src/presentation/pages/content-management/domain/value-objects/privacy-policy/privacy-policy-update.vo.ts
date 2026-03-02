import { PrivacyPolicyUpdateDto } from '@presentation/pages/content-management/application/dto/privacy-policy/privacy-policy-update.dto';

export class PrivacyPolicyUpdateVo {
    public readonly uniqId: string;
    public readonly version: string;
    public readonly content: string;

    constructor(props: { uniqId: string; version: string; content: string }) {
        this.uniqId = props.uniqId;
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: PrivacyPolicyUpdateDto): PrivacyPolicyUpdateVo {
        return new PrivacyPolicyUpdateVo({
            uniqId: dto.uniqId,
            version: dto.version,
            content: dto.content,
        });
    }
}
