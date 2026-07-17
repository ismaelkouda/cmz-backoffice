import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import {
    AuthToken,
    CurrentUser,
} from '@shared/domain/interfaces/current-user.interface';

export interface ForgotPasswordResponseApiDto {
    readonly token: AuthToken;
    readonly user: CurrentUser;
    readonly message?: string;
}

export type ForgotPasswordResponseDto =
    SimpleResponseDto<ForgotPasswordResponseApiDto>;
