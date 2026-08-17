import { TeamsUpdateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.contract';
import { TeamsUpdateValidateContract } from '@pages/team-organization/domain/contracts/teams/teams-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateTeamsUpdate(
    contract: TeamsUpdateContract
): asserts contract is TeamsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.name) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.NAME_REQUIRE'
        );
    }
    if (!contract.description) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.DESCRIPTION_REQUIRE'
        );
    }
    if (!contract.reportTypes?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.REPORT_TYPES_REQUIRE'
        );
    }
    if (!contract.operators?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.OPERATORS_REQUIRE'
        );
    }
    if (!contract.permissions?.length) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.TEAMS.FORM.ERROR.UPDATE.PERMISSIONS_REQUIRE'
        );
    }
}
