import { PrivacyPolicyCreateDto } from '@pages/content-management/application/dto/privacy-policy/privacy-policy-create.dto';

export class PrivacyPolicyCreateVo {
    public readonly version: string;
    public readonly content: string;

    constructor(props: { version: string; content: string }) {
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: PrivacyPolicyCreateDto): PrivacyPolicyCreateVo {
        return new PrivacyPolicyCreateVo({
            version: dto.version,
            content: dto.content,
        });
    }
}
