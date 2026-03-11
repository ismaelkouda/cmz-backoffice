import { TermsUseFindOneFilterDto } from '@pages/content-management/application/dto/terms-use/terms-use-find-one-filter.dto';

export class TermsUseFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: TermsUseFindOneFilterDto): TermsUseFindOneFilterVo {
        return new TermsUseFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
