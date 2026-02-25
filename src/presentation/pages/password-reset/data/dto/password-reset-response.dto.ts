export interface PasswordResetResponseDto {
    message: string;
    error?: boolean;
    data?: {
        success: boolean;
    };
}
