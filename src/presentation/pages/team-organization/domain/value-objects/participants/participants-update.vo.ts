import { ParticipantsUpdateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.contract';
import { ParticipantsUpdateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-update.validate-contract';
import { validateParticipantsUpdate } from '@pages/team-organization/domain/validators/participants/participants-update.validator';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';

export function participantsUpdateVo(
    contract: ParticipantsUpdateContract
): ParticipantsUpdateValidateContract {
    validateParticipantsUpdate(contract);
    return {
        uniqId: contract.uniqId,
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: normalizePhoneNumber(contract.phone?.trim()) as string,
        role: contract.role,
        team: contract.team,
    };
}
