import { Provider } from '@angular/core';
import { ValidateOtpRepository } from '@presentation/pages/authentication/domain/repositories/verify-otp/validate-otp.repository';
import { ValidateOtpRepositoryImpl } from '@presentation/pages/authentication/infrastructure/data/repositories/verify-otp/validate-otp.repository.impl';

export const validateOtpProviders: Provider[] = [
    {
        provide: ValidateOtpRepository,
        useClass: ValidateOtpRepositoryImpl,
    },
];
