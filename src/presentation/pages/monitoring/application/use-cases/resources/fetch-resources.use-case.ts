import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourcesEntity } from '../../../domain/entities/resources/resources.entity';
import { ResourcesRepository } from '../../../domain/repositories/resources-repository.interface';

@Injectable({
    providedIn: 'root',
})
export class FetchResourcesUseCase {
    private readonly repository = inject(ResourcesRepository);

    execute(): Observable<ResourcesEntity> {
        return this.repository.fetchResources();
    }
}
