import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';

export interface DepartmentsSelectProps {
    readonly uniqId: number;
    readonly name: string;
    readonly value: string;
    readonly municipalities: readonly MunicipalitiesSelectProps[];
}
