import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface ForgotPasswordResponseApiDto {
    readonly retry_after: number;
}

export type ForgotPasswordResponseDto =
    SimpleResponseDto<ForgotPasswordResponseApiDto>;
