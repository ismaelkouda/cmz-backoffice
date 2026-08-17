import { TeamsCreateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.contract';
import { TeamsCreateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.validate-contract';
import { validateTeamsCreate } from '@pages/team-organization/domain/validators/teams/teams-create.validator';

export function teamsCreateVo(
    contract: TeamsCreateContract
): TeamsCreateValidateContract {
    validateTeamsCreate(contract);
    return {
        // code: contract.code,
        name: contract.name,
        description: contract.description,
        operators: contract.operators,
        reportTypes: contract.reportTypes,
        permissions: contract.permissions,
    };
}
