import { MunicipalitiesSelectProps } from '@shared/domain/interfaces/municipalities-select.props.interface';

export class MunicipalitiesSelectEntity {
    constructor(private readonly props: MunicipalitiesSelectProps) {}

    get uniqId(): string {
        return this.props.uniqId;
    }

    get name(): string {
        return this.props.name;
    }

    get value(): string {
        return this.props.value;
    }

    with(props: MunicipalitiesSelectProps): MunicipalitiesSelectEntity {
        if (this.hasSameProps(props)) {
            return this;
        }

        return new MunicipalitiesSelectEntity(props);
    }

    private hasSameProps(props: MunicipalitiesSelectProps): boolean {
        return (
            this.uniqId !== props.uniqId ||
            this.name !== props.name ||
            this.value !== props.value
        );
    }
}
