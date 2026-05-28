import { Injectable, inject } from '@angular/core';
import { ResourcesHandler } from '@pages/monitoring/application/queries-handlers/resources/resources.handler';
import { ResourcesEntity } from '@pages/monitoring/domain/entities/resources/resources.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ResourcesBus {
    private readonly filterHandler = inject(ResourcesHandler);

    dispatch(): Observable<ResourcesEntity> {
        return this.filterHandler.execute();
    }
}
