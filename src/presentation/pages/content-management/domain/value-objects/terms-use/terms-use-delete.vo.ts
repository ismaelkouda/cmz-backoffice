import { TermsUseDeleteDto } from '@pages/content-management/application/dto/terms-use/terms-use-delete.dto';

export class TermsUseDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TermsUseDeleteDto): TermsUseDeleteVo {
        return new TermsUseDeleteVo({
            uniqId: dto.uniqId.trim(),
        });
    }
}
