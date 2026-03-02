import { LegalNoticeFilterVo } from '@presentation/pages/content-management/domain/value-objects/legal-notice/legal-notice-filter.vo';

export class LegalNoticeFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: LegalNoticeFilterVo): LegalNoticeFilterEntity {
        return new LegalNoticeFilterEntity(
            vo.search,
            vo.version,
            vo.status,
            vo.startDate,
            vo.endDate
        );
    }
}
