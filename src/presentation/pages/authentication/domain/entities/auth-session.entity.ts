import {
    AuthToken,
    CurrentUser,
} from '@shared/interfaces/current-user.interface';
export interface AuthSession {
    readonly user: CurrentUser;
    readonly token: AuthToken;
    readonly message?: string;
}
