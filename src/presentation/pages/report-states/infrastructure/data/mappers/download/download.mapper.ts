import { inject, Injectable } from '@angular/core';
import { DownloadEntity } from '@pages/report-states/domain/entities/download/download.entity';
import { DownloadProps } from '@pages/report-states/domain/interfaces/download/download-props.interface';
import { DownloadItemApiDto } from '@pages/report-states/infrastructure/api/dto/download/download-response-api.dto';
import { StatusMapper } from '@pages/report-states/infrastructure/data/mappers/download/download-status.mapper';
import { PaginatedMapper } from '@shared/data/mappers/base/paginated-response.mapper';
import { MapperUtils } from '@shared/domain/utils/mapper-utils';
import { DownloadTypeMapper } from '../download-type.mapper';

@Injectable({ providedIn: 'root' })
export class DownloadMapper extends PaginatedMapper<
    DownloadEntity,
    DownloadItemApiDto
> {
    private readonly utils = new MapperUtils();
    private readonly entityCache = new Map<string, DownloadEntity>();

    private readonly statusMapper = inject(StatusMapper);
    private readonly typeDto = inject(DownloadTypeMapper);

    protected override mapItemFromDto(dto: DownloadItemApiDto): DownloadEntity {
        MapperUtils.validateDto(dto, {
            required: ['id'],
        });

        const filters = dto.filters.map((item) => ({
            name: item.key_label,
            value: item.value_label,
        }));

        const props: DownloadProps = {
            uniqId: dto.id,
            url: dto.download_url,
            name: dto.file_name,
            size: dto.file_size,
            type: this.typeDto.mapFromDto(dto.format),
            status: this.statusMapper.mapApiToStatus(dto.status),
            filters,
            createdAt: dto.created_at,
        };

        const cacheKey = `dto:${dto.id}`;
        const cached = this.entityCache.get(cacheKey);

        const entity = cached
            ? cached.with(props, this.statusMapper)
            : new DownloadEntity(props, this.statusMapper);

        this.entityCache.set(cacheKey, entity);
        return entity;
    }
}
