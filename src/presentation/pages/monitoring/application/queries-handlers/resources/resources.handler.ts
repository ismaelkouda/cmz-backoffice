import { Injectable, inject } from '@angular/core';
import { ResourcesUseCase } from '@pages/monitoring/application/use-cases/resources/resources.use-case';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesHandler {
    private readonly useCase = inject(ResourcesUseCase);

    execute(options?: FetchOptions): Observable<ResourcesEntity> {
        return this.useCase.execute(options);
    }
}
