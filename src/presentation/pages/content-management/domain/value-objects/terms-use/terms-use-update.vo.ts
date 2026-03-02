import { TermsUseUpdateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-update.dto';

export class TermsUseUpdateVo {
    public readonly uniqId: string;
    public readonly version: string;
    public readonly content: string;

    constructor(props: { uniqId: string; version: string; content: string }) {
        this.uniqId = props.uniqId;
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: TermsUseUpdateDto): TermsUseUpdateVo {
        return new TermsUseUpdateVo({
            uniqId: dto.uniqId,
            version: dto.version,
            content: dto.content,
        });
    }
}
