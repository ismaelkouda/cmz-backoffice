import { Injectable } from '@angular/core';
import {
    GetTermsUseByIdItemDto,
    GetTermsUseByIdResponseDto,
} from '@presentation/pages/content-management/core/application/dtos/terms-use/get-terms-use-by-id-response.dto';
import { GetTermsUseByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-terms-use-by-id.entity';
import { SimpleResponseMapper } from '@shared/data/mappers/base/simple-response.mapper';

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
