import { Injectable } from '@angular/core';

import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

import {
    GetTermsUseByIdItemDto,
    GetTermsUseByIdResponseDto,
} from '@presentation/pages/content-management/application/dto/terms-use/get-terms-use-by-id-response.dto';
import { GetTermsUseByIdEntity } from '@presentation/pages/content-management/domain/entities/get-terms-use-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class GetTermsUseByIdMapper extends SimpleResponseMapper<
    GetTermsUseByIdEntity,
    GetTermsUseByIdItemDto
> {
    public toEntity(dto: GetTermsUseByIdResponseDto): GetTermsUseByIdEntity {
        return this.mapItemFromDto(dto.data);
    }
    public mapItemFromDto(dto: GetTermsUseByIdItemDto): GetTermsUseByIdEntity {
        return new GetTermsUseByIdEntity(dto.content, dto.version);
    }
}
