import { Observable } from 'rxjs';

import { MapEntity } from '../entities/map/map.entity';

export abstract class MapRepository {
    abstract getMap(): Observable<MapEntity>;
}
