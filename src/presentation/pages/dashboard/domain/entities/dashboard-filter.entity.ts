import { DashboardFilterVo } from '@pages/dashboard/domain/value-objects/dashboard-filter.vo';

export class DashboardFilterEntity {
    constructor(public readonly period: string) {}

    static fromVo(vo: DashboardFilterVo): DashboardFilterEntity {
        return new DashboardFilterEntity(vo.period);
    }
}
