import { DepartmentsSelectProps } from '@shared/domain/interfaces/departments-select.props.interface';
import { RegionsSelectProps } from '@shared/domain/interfaces/regions-select.props.interface';
export class RegionsSelectEntity {
    constructor(private readonly props: RegionsSelectProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get value(): string {
        return this.props.value;
    }

    get departments(): readonly DepartmentsSelectProps[] {
        return this.props.departments;
    }

    with(props: RegionsSelectProps): RegionsSelectEntity {
        if (this.hasSameProps(props)) {
            return this;
        }

        return new RegionsSelectEntity(props);
    }

    private hasSameProps(props: RegionsSelectProps): boolean {
        if (
            this.uniqId !== props.uniqId ||
            this.name !== props.name ||
            this.value !== props.value
        ) {
            return false;
        }

        if (this.departments.length !== props.departments.length) {
            return false;
        }

        return this.departments.every((department, index) => {
            const otherDepartment = props.departments[index];

            if (
                department.uniqId !== otherDepartment.uniqId ||
                department.name !== otherDepartment.name ||
                department.value !== otherDepartment.value
            ) {
                return false;
            }

            if (
                department.municipalities.length !==
                otherDepartment.municipalities.length
            ) {
                return false;
            }

            return department.municipalities.every((municipality, mIndex) => {
                const otherMunicipality =
                    otherDepartment.municipalities[mIndex];

                return (
                    municipality.uniqId === otherMunicipality.uniqId &&
                    municipality.name === otherMunicipality.name &&
                    municipality.value === otherMunicipality.value
                );
            });
        });
    }
}
