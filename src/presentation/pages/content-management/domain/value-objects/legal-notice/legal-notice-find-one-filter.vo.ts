import { LegalNoticeFindOneFilterDto } from '@pages/content-management/application/dto/legal-notice/legal-notice-find-one-filter.dto';

export class LegalNoticeFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: LegalNoticeFindOneFilterDto
    ): LegalNoticeFindOneFilterVo {
        return new LegalNoticeFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
