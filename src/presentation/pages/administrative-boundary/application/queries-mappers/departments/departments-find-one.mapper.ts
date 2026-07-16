import { DepartmentsFindOneQuery } from '@pages/administrative-boundary/application/queries/departments/departments-find-one.query';

export function departmentsFindOneQueryMapper(
    command: DepartmentsFindOneQuery
) {
    return {
        uniqId: command.uniqId,
    };
}
