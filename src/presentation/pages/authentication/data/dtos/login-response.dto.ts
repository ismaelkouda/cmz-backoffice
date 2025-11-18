import {
    AuthToken,
    CurrentUser,
} from '../../../../../shared/interfaces/current-user.interface';

interface LoginDataDto {
    readonly token: AuthToken;
    readonly user: CurrentUser;
}

export interface LoginResponseDto {
    readonly data: LoginDataDto | null;
    readonly error: boolean;
    readonly message: string;
}
