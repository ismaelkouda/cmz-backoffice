import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';

export interface DepartmentsSelectProps {
    readonly uniqId: string;
    readonly name: string;
    readonly value: string;
    readonly municipalities: readonly MunicipalitiesSelectProps[];
}
