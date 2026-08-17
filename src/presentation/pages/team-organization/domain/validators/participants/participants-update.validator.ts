import { ParticipantsUpdateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.contract';
import { ParticipantsUpdateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.validate-contract';
import { GenericRequiredError } from '@shared/domain/errors/validation/generic.error';

export function validateParticipantsUpdate(
    contract: ParticipantsUpdateContract
): asserts contract is ParticipantsUpdateValidateContract {
    if (!contract.uniqId) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.PARTICIPANTS.FORM.ERROR.UPDATE.UNIQ_ID_REQUIRE'
        );
    }
    if (!contract.firstName) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.PARTICIPANTS.FORM.ERROR.UPDATE.FIRST_NAME_REQUIRE'
        );
    }
    if (!contract.lastName) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.PARTICIPANTS.FORM.ERROR.UPDATE.LAST_NAME_REQUIRE'
        );
    }
    if (!contract.email) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.PARTICIPANTS.FORM.ERROR.UPDATE.EMAIL_REQUIRE'
        );
    }
    if (contract.team && !contract.role) {
        throw new GenericRequiredError(
            'TEAM_ORGANIZATION.PARTICIPANTS.FORM.ERROR.UPDATE.ROLE_REQUIRE'
        );
    }
}
