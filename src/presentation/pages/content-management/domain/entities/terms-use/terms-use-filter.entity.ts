import { TermsUseFilterVo } from '@presentation/pages/content-management/domain/value-objects/terms-use/terms-use-filter.vo';

export class TermsUseFilterEntity {
    constructor(
        public readonly search?: string,
        public readonly version?: string,
        public readonly status?: string,
        public readonly startDate?: string,
        public readonly endDate?: string
    ) {}

    static fromVo(vo: TermsUseFilterVo): TermsUseFilterEntity {
        return new TermsUseFilterEntity(
            vo.search,
            vo.version,
            vo.status,
            vo.startDate,
            vo.endDate
        );
    }
}
