import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import {
    GetPrivacyPolicyByIdItemDto,
    GetPrivacyPolicyByIdResponseDto,
} from '@presentation/pages/content-management/application/dto/privacy-policy/get-privacy-policy-by-id-response.dto';
import { GetPrivacyPolicyByIdEntity } from '@presentation/pages/content-management/domain/entities/get-privacy-policy-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class GetPrivacyPolicyByIdMapper extends SimpleResponseMapper<
    GetPrivacyPolicyByIdEntity,
    GetPrivacyPolicyByIdItemDto
> {
    public toEntity(
        dto: GetPrivacyPolicyByIdResponseDto
    ): GetPrivacyPolicyByIdEntity {
        return this.mapItemFromDto(dto.data);
    }
    public mapItemFromDto(
        dto: GetPrivacyPolicyByIdItemDto
    ): GetPrivacyPolicyByIdEntity {
        return new GetPrivacyPolicyByIdEntity(dto.content, dto.version);
    }
}
