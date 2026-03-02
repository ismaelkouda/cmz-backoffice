import { DepartmentsFindOneFilterDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-find-one-filter.dto';

export class DepartmentsFindOneFilterVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(
        dto: DepartmentsFindOneFilterDto
    ): DepartmentsFindOneFilterVo {
        return new DepartmentsFindOneFilterVo({
            uniqId: dto.uniqId,
        });
    }
}
