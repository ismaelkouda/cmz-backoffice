import { UsersUpdateContract } from '@pages/settings-security/domain/contracts/users/users-update.contract';
import { UsersUpdateValidateContract } from '@pages/settings-security/domain/contracts/users/users-update.validate-contract';
import { validateUsersUpdate } from '@pages/settings-security/domain/validators/users/users-update.validator';

export function usersUpdateVo(
    contract: UsersUpdateContract
): UsersUpdateValidateContract {
    validateUsersUpdate(contract);
    return {
        uniqId: contract.uniqId,
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: contract.phone ?? '',
        profile: contract.profile,
        // role: contract.role,
    };
}
