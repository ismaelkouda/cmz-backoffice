import { LegalNoticeUpdateDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-update.dto';

export class LegalNoticeUpdateVo {
    public readonly uniqId: string;
    public readonly version: string;
    public readonly content: string;

    constructor(props: { uniqId: string; version: string; content: string }) {
        this.uniqId = props.uniqId;
        this.version = props.version;
        this.content = props.content;
    }

    static fromDto(dto: LegalNoticeUpdateDto): LegalNoticeUpdateVo {
        return new LegalNoticeUpdateVo({
            uniqId: dto.uniqId,
            version: dto.version,
            content: dto.content,
        });
    }
}
