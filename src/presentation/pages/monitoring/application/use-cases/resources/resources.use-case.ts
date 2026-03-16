import { Injectable, inject } from '@angular/core';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { ResourcesRepository } from '@pages/monitoring/domain/repositories/resources-repository.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ResourcesUseCase {
    private readonly repository = inject(ResourcesRepository);

    execute(): Observable<ResourcesEntity> {
        return this.repository.fetchResources();
    }
}
