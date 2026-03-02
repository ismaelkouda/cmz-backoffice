import { DepartmentsFindOneFilterVo } from '@presentation/pages/administrative-boundary/domain/value-objects/departments/departments-find-one-filter.vo';

export class DepartmentsFindOneFilterEntity {
    constructor(public readonly uniqId: string) {}

    static fromVo(
        vo: DepartmentsFindOneFilterVo
    ): DepartmentsFindOneFilterEntity {
        return new DepartmentsFindOneFilterEntity(vo.uniqId);
    }
}
