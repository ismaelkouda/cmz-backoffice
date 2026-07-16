import { InfrastructureTypeSelectProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure-type/infrastructure-type-select-props.interface';

export class InfrastructureTypeSelectEntity {
    constructor(private readonly props: InfrastructureTypeSelectProps) {}

    get label(): string {
        return this.props.label;
    }

    get value(): string {
        return this.props.value;
    }
}
