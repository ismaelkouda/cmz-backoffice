import { Injectable, inject } from '@angular/core';
import { ServicesHandler } from '@pages/monitoring/application/queries-handlers/services/services.handler';
import { ServicesEntity } from '@pages/monitoring/domain/entities/services/services.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesBus {
    private readonly filterHandler = inject(ServicesHandler);

    dispatch(): Observable<ServicesEntity> {
        return this.filterHandler.execute();
    }
}
