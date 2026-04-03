import { Injectable } from '@angular/core';
import { MapClustersQuery } from '@shared/components/map-clusters/application/queries/map-clusters.query';
import { MapClustersHandler } from '@shared/components/map-clusters/application/queries-handlers/map-clusters.handler';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapClustersBus {
    constructor(private readonly filterHandler: MapClustersHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<MapClustersEntity>> {
        if (query instanceof MapClustersQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
