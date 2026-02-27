import { TermsUseCreateDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-create.dto';

export class TermsUseCreateVo {
    public readonly version: string;
    public readonly content: string;

    constructor(props: { version: string; content: string }) {
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: TermsUseCreateDto): TermsUseCreateVo {
        return new TermsUseCreateVo({
            version: dto.version,
            content: dto.content,
        });
    }
}
