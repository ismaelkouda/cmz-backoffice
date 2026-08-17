import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface LoginProps {
    readonly user: CurrentUser;
    readonly token: AuthToken;
    readonly message?: string;
}
