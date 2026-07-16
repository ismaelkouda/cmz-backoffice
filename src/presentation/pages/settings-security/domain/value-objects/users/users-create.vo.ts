import { UsersCreateContract } from '@pages/settings-security/domain/contracts/users/users-create.contract';
import { UsersCreateValidateContract } from '@pages/settings-security/domain/contracts/users/users-create.validate-contract';
import { validateUsersCreate } from '@pages/settings-security/domain/validators/users/users-create.validator';

export function usersCreateVo(
    contract: UsersCreateContract
): UsersCreateValidateContract {
    validateUsersCreate(contract);
    return {
        firstName: contract.firstName,
        lastName: contract.lastName,
        email: contract.email,
        phone: contract.phone ?? '',
        profile: contract.profile,
        // role: contract.role,
    };
}
