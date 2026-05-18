import { Injectable } from '@angular/core';
import { MapHandler } from '@pages/geographical-map/application/queries-handlers/map/map.handler';
import { MapEntity } from '@pages/geographical-map/domain/entities/map/map.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapBus {
    constructor(private readonly filterHandler: MapHandler) {}

    dispatch(): Observable<MapEntity> {
        return this.filterHandler.execute();
    }
}
