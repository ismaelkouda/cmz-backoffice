import { LoginRequestValidateContract } from '@presentation/pages/authentication/domain/contracts/login/login-request.validate-contract';
import { LoginRequestApiDto } from '@presentation/pages/authentication/infrastructure/api/dto/login/login-request-api.dto';

export function loginRequestMapper(
    validContract: LoginRequestValidateContract
): LoginRequestApiDto {
    return {
        email: validContract.email,
        password: validContract.password,
    };
}
