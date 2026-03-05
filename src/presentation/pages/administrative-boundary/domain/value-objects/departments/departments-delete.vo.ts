import { DepartmentsDeleteDto } from '@presentation/pages/administrative-boundary/application/dto/departments/departments-delete.dto';

export class DepartmentsDeleteVo {
    public readonly uniqId: string;

    constructor(props: { uniqId: string }) {
        this.uniqId = props.uniqId;
    }

    static fromDto(dto: DepartmentsDeleteDto): DepartmentsDeleteVo {
        return new DepartmentsDeleteVo({
            uniqId: dto.uniqId,
        });
    }
}
