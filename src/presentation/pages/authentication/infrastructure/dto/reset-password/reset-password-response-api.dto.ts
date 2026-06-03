import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface ResetPasswordResponseApiDto {
    readonly token: AuthToken;
    readonly user: CurrentUser;
    readonly message?: string;
}

export type ResetPasswordResponseDto =
    SimpleResponseDto<ResetPasswordResponseApiDto>;
