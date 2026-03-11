import { LegalNoticePublishDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-publish.dto';

export class LegalNoticePublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: LegalNoticePublishDto): LegalNoticePublishVo {
        return new LegalNoticePublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
