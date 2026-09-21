import { ReportNewspaperFilterVo } from '@shared/components/report-newspaper/domain/value-objects/report-newspaper-filter.vo';

export class ReportNewspaperFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(vo: ReportNewspaperFilterVo): ReportNewspaperFilterEntity {
        return new ReportNewspaperFilterEntity(vo.uniqId);
    }
}
