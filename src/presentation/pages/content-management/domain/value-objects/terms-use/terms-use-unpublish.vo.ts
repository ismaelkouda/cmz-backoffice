import { TermsUseUnpublishDto } from '@pages/content-management/application/dto/terms-use/terms-use-unpublish.dto';

export class TermsUseUnpublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TermsUseUnpublishDto): TermsUseUnpublishVo {
        return new TermsUseUnpublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
