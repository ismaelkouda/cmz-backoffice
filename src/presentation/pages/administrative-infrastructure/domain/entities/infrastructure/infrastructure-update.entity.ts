import { InfrastructureUpdateValidateContract } from '@presentation/pages/administrative-infrastructure/domain/contracts/infrastructure/infrastructure-update.validate-contract';

export class InfrastructureUpdateEntity {
    constructor(
        private readonly contract: InfrastructureUpdateValidateContract
    ) {}

    get data(): InfrastructureUpdateValidateContract {
        return this.contract;
    }
}
