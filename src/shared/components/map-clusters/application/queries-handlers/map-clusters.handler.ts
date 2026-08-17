import { Injectable, inject } from '@angular/core';
import { MapClustersQuery } from '@shared/components/map-clusters/application/queries/map-clusters.query';
import { MapClustersUseCase } from '@shared/components/map-clusters/application/use-cases/map-clusters.use-case';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapClustersHandler {
    private readonly useCase = inject(MapClustersUseCase);

    execute(
        query: MapClustersQuery,
        page: string
    ): Observable<Paginate<MapClustersEntity>> {
        return this.useCase.execute(
            {
                minLat: query.minLat,
                maxLat: query.maxLat,
                minLng: query.minLng,
                maxLng: query.maxLng,
            },
            page
        );
    }
}
