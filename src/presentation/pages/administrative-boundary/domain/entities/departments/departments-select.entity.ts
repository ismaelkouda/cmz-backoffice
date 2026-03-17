import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';
import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';

export class DepartmentsSelectEntity {
    constructor(private readonly props: DepartmentsSelectProps) {}

    get uniqId(): number {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get value(): string {
        return this.props.value;
    }

    get municipalities(): readonly MunicipalitiesSelectProps[] {
        return this.props.municipalities;
    }

    with(props: DepartmentsSelectProps): DepartmentsSelectEntity {
        if (this.hasSameProps(props)) {
            return this;
        }

        return new DepartmentsSelectEntity(props);
    }

    private hasSameProps(props: DepartmentsSelectProps): boolean {
        if (
            this.uniqId !== props.uniqId ||
            this.name !== props.name ||
            this.value !== props.value
        ) {
            return false;
        }

        if (this.municipalities.length !== props.municipalities.length) {
            return false;
        }

        return this.municipalities.every((municipality, index) => {
            const otherMunicipality = props.municipalities[index];
            return (
                municipality.uniqId === otherMunicipality.uniqId &&
                municipality.value === otherMunicipality.value &&
                municipality.name === otherMunicipality.name
            );
        });
    }
}
