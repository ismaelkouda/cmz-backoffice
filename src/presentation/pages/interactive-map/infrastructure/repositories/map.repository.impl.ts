import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { MapEntity } from '../../domain/entities/map/map.entity';
import { MapMapper } from '../data/mappers/map.mapper';
import { MapApi } from '../data/sources/map.api';
import { MapRepository } from '../../domain/repositories/map-repository.interface';

@Injectable({ providedIn: 'root' })
export class MapRepositoryImpl implements MapRepository {
    private readonly api = inject(MapApi);
    private readonly mapMapper = inject(MapMapper);

    getMap(): Observable<MapEntity> {
        return this.api
            .getMap()
            .pipe(map((response) => this.mapMapper.mapFromDto(response)));
    }
}
