import { InfrastructureSelectProps } from '@presentation/pages/administrative-infrastructure/domain/interfaces/infrastructure/infrastructure-select-props.interface';

export class InfrastructureSelectEntity {
    constructor(private readonly props: InfrastructureSelectProps) {}

    get label(): string {
        return this.props.label;
    }

    get value(): string {
        return this.props.value;
    }
}
