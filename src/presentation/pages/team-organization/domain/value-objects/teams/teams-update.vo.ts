import { TeamsUpdateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.contract';
import { TeamsUpdateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.validate-contract';
import { validateTeamsUpdate } from '@pages/team-organization/domain/validators/teams/teams-update.validator';

export function teamsUpdateVo(
    contract: TeamsUpdateContract
): TeamsUpdateValidateContract {
    validateTeamsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        // code: contract.code,
        name: contract.name,
        description: contract.description,
        operators: contract.operators,
        reportTypes: contract.reportTypes,
        permissions: contract.permissions,
    };
}
