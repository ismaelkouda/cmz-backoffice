import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface LoginResponseProps {
    readonly user: CurrentUser;
    readonly token: AuthToken;
    readonly message?: string;
}
