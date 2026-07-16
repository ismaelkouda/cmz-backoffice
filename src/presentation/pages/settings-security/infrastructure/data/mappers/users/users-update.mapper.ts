import { UsersUpdateValidateContract } from '@pages/settings-security/domain/contracts/users/users-update.validate-contract';
import { UsersUpdateApiDto } from '@pages/settings-security/infrastructure/api/dto/users/users-update-api.dto';

export function usersUpdateMapper(
    props: UsersUpdateValidateContract
): UsersUpdateApiDto {
    const params: UsersUpdateApiDto = {} as UsersUpdateApiDto;

    if (props.uniqId) {
        params.id = props.uniqId;
    }
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
