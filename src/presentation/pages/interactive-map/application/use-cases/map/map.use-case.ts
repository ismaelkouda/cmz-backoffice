import { Injectable, inject } from '@angular/core';
import { MapEntity } from '@presentation/pages/interactive-map/domain/entities/map/map.entity';
import { MapRepository } from '@pages/interactive-map/domain/repositories/map-repository.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MapUseCase {
    private readonly repository = inject(MapRepository);

    execute(): Observable<MapEntity> {
        return this.repository.getMap();
    }
}
