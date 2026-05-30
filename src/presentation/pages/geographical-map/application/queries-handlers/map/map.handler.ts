import { Injectable, inject } from '@angular/core';
import { MapUseCase } from '@pages/geographical-map/application/use-cases/map/map.use-case';
import { MapEntity } from '@pages/geographical-map/domain/entities/map/map.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapHandler {
    private readonly useCase = inject(MapUseCase);

    execute(): Observable<MapEntity> {
        return this.useCase.execute();
    }
}
