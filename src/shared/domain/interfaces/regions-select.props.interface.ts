import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';

export interface RegionsSelectProps {
    readonly uniqId: number;
    readonly name: string;
    readonly value: string;
    readonly departments: readonly DepartmentsSelectProps[];
}
