import { TeamsCreateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.contract';
import { TeamsCreateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-create.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTeamsCreate(
    contract: TeamsCreateContract
): asserts contract is TeamsCreateValidateContract {
    if (!contract.name) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.CREATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.CREATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.reportTypes?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.CREATE.REPORT_TYPES_REQUIRE'
        );
    }
    if (!contract.operators?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.CREATE.OPERATORS_REQUIRE'
        );
    }
    if (!contract.permissions?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.CREATE.PERMISSIONS_REQUIRE'
        );
    }
}
