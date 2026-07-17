import { UsersCreateValidateContract } from '@pages/settings-security/domain/contracts/users/users-create.validate-contract';
import { UsersCreateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-create-api.dto';

export function usersCreateMapper(
    props: UsersCreateValidateContract
): UsersCreateApiDto {
    const params: UsersCreateApiDto = {} as UsersCreateApiDto;

    if (props.firstName) {
        params.first_name = props.firstName;
    }
    if (props.lastName) {
        params.last_name = props.lastName;
    }
    if (props.email) {
        params.email = props.email;
    }
    if (props.phone) {
        params.phone = props.phone;
    }
    if (props.profile) {
        params.profile_id = props.profile;
    }
    // if (props.role) {
    //     params.role = props.role;
    // }

    return params;
}
