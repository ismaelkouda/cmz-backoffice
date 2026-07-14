import { InfrastructureCreateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-create.validate-contract';

export class InfrastructureCreateEntity {
    constructor(
        private readonly contract: InfrastructureCreateValidateContract
    ) {}

    get data(): InfrastructureCreateValidateContract {
        return this.contract;
    }
}
