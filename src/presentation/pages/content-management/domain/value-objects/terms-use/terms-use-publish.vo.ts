import { TermsUsePublishDto } from '@presentation/pages/content-management/application/dto/terms-use/terms-use-publish.dto';

export class TermsUsePublishVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TermsUsePublishDto): TermsUsePublishVo {
        return new TermsUsePublishVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
