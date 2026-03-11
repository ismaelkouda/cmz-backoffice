import { LegalNoticeCreateDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-create.dto';

export class LegalNoticeCreateVo {
    public readonly version: string;
    public readonly content: string;

    constructor(props: { version: string; content: string }) {
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: LegalNoticeCreateDto): LegalNoticeCreateVo {
        return new LegalNoticeCreateVo({
            version: dto.version,
            content: dto.content,
        });
    }
}
