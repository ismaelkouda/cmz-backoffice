import { Injectable, inject } from '@angular/core';
import { MapUseCase } from '@pages/interactive-map/application/use-cases/map/map.use-case';
import { MapEntity } from '@presentation/pages/interactive-map/domain/entities/map/map.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapHandler {
    private readonly useCase = inject(MapUseCase);

    execute(): Observable<MapEntity> {
        return this.useCase.execute();
    }
}
