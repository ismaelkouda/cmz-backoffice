import { LegalNoticeDeleteDto } from '@presentation/pages/content-management/application/dto/legal-notice/legal-notice-delete.dto';

export class LegalNoticeDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: LegalNoticeDeleteDto): LegalNoticeDeleteVo {
        return new LegalNoticeDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
