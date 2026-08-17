import { MapClustersFilterEntity } from '@shared/components/map-clusters/domain/entities/map-clusters-filter.entity';
import { MapClustersEntity } from '@shared/components/map-clusters/domain/entities/map-clusters.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class MapClustersRepository {
    abstract execute(
        entity: MapClustersFilterEntity,
        page: string
    ): Observable<Paginate<MapClustersEntity>>;
}
