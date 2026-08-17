import { inject, Injectable } from '@angular/core';
import { MapClustersFilterEntity } from '@shared/components/map-clusters/domain/entities/map-clusters-filter.entity';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { MapClustersRepository } from '@shared/components/map-clusters/domain/repositories/map-clusters.repository';
import { mapClustersFilterMapper } from '@shared/components/map-clusters/infrastructure/data/mappers/map-clusters-filter.mapper';
import { MapClustersMapper } from '@shared/components/map-clusters/infrastructure/data/mappers/map-clusters.mapper';
import { MapClustersApi } from '@shared/components/map-clusters/infrastructure/data/sources/map-clusters.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MapClustersRepositoryImpl extends MapClustersRepository {
    private readonly api = inject(MapClustersApi);
    private readonly mapper = inject(MapClustersMapper);

    execute(
        entity: MapClustersFilterEntity,
        page: string
    ): Observable<Paginate<MapClustersEntity>> {
        return this.api
            .execute(mapClustersFilterMapper(entity), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
