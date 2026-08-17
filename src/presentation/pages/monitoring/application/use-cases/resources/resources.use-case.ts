import { Injectable, inject } from '@angular/core';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { ResourcesRepository } from '@pages/monitoring/domain/repositories/resources-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResourcesUseCase {
    private readonly repository = inject(ResourcesRepository);

    execute(options?: FetchOptions): Observable<ResourcesEntity> {
        return this.repository.fetchResources(options);
    }
}
