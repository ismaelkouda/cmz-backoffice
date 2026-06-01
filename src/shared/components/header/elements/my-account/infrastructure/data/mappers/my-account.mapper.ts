// import { Injectable } from '@angular/core';
// import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

// import { MyAccountResultEntity } from '../../../domain/entities/my-account-result.entity';
// import {
//     TwoFactorChallengeEntity,
//     TwoFactorEntity,
// } from '../../../domain/entities/two-factor.entity';
// import { PasswordEntity } from '../../../domain/entities/password-change.entity';
// import { ProfileEntity } from '../../../domain/entities/profile-update.entity';
// import { ChangePasswordApiDto } from '../../api/dto/password-change-api.dto';
// import {
//     TwoFactorApiDto,
//     TwoFactorChallengeApiDto,
// } from '../../api/dto/two-factor-disable-api.dto';
// import { UpdateProfileApiDto } from '../../api/dto/profile-update-api.dto';
// import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

// @Injectable({ providedIn: 'root' })
// export class MyAccountMapper extends SimpleResponseMapper<> {
//     toChangePasswordApi(entity: PasswordEntity): ChangePasswordApiDto {
//         return {
//             old_password: entity.oldPassword,
//             new_password: entity.newPassword,
//             new_password_confirmation: entity.newPasswordConfirmation,
//         };
//     }

//     toUpdateProfileApi(entity: ProfileEntity): UpdateProfileApiDto {
//         return {
//             id: entity.id,
//             last_name: entity.lastName,
//             first_name: entity.firstName,
//             email: entity.email,
//             phone: entity.phone,
//         };
//     }

//     toResultEntity(dto: SimpleResponseDto<unknown>): MyAccountResultEntity {
//         return {
//             error: dto.error,
//             message: dto.message,
//         };
//     }

//     toTwoFactorChallenge(
//         dto: SimpleResponseDto<TwoFactorChallengeApiDto>
//     ): TwoFactorChallengeEntity {
//         return {
//             message: dto.message,
//             maskedRecipient: dto.data?.masked_recipient ?? '',
//             expiresInSeconds: dto.data?.expires_in_seconds ?? 300,
//         };
//     }
// }
