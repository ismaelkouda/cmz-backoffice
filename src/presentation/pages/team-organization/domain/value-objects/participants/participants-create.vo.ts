import { ParticipantsCreateContract } from '@pages/team-organization/domain/contracts/participants/participants-create.contract';
import { ParticipantsCreateValidateContract } from '@pages/team-organization/domain/contracts/participants/participants-create.validate-contract';
import { validateParticipantsCreate } from '@pages/team-organization/domain/validators/participants/participants-create.validator';
import { normalizePhoneNumber } from '@shared/domain/services/normalize-phone-number';

export function participantsCreateVo(
    contract: ParticipantsCreateContract
): ParticipantsCreateValidateContract {
    validateParticipantsCreate(contract);
    return {
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: normalizePhoneNumber(contract.phone?.trim()) as string,
        role: contract.role,
        team: contract.team,
    };
}
