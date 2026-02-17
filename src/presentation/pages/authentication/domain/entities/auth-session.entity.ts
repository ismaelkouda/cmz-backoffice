import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';
export interface AuthSession {
    readonly user: CurrentUser;
    readonly token: AuthToken;
    readonly message?: string;
}
