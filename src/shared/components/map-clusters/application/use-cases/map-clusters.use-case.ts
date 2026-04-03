import { inject, Injectable } from '@angular/core';
import { MapClustersFilterDto } from '@shared/components/map-clusters/application/dto/map-clusters-filter.dto';
import { MapClustersFilterEntity } from '@shared/components/map-clusters/domain/entities/map-clusters-filter.entity';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { MapClustersRepository } from '@shared/components/map-clusters/domain/repositories/map-clusters.repository';
import { MapClustersFilterVo } from '@shared/components/map-clusters/domain/value-objects/map-clusters-filter.vo';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MapClustersUseCase {
    private readonly repository = inject(MapClustersRepository);

    execute(
        filterDto: MapClustersFilterDto,
        page: string
    ): Observable<Paginate<MapClustersEntity>> {
        const vo = MapClustersFilterVo.fromDto(filterDto);
        const entity = MapClustersFilterEntity.fromVo(vo);
        return this.repository.execute(entity, page);
    }
}
