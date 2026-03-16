import { Injectable } from '@angular/core';
import { ResourcesUseCase } from '@pages/monitoring/application/use-cases/resources/resources.use-case';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesHandler {
    constructor(private readonly useCase: ResourcesUseCase) {}

    execute(): Observable<ResourcesEntity> {
        return this.useCase.execute();
    }
}
