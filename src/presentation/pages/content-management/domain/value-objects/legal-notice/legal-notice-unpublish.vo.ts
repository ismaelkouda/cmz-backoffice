import { LegalNoticeUnpublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-unpublish.dto';

export class LegalNoticeUnpublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: LegalNoticeUnpublishDto): LegalNoticeUnpublishVo {
        return new LegalNoticeUnpublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
