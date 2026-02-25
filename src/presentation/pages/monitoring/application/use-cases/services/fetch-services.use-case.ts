import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ServicesEntity } from '../../../domain/entities/services/services.entity';
import { ServicesRepository } from '../../../domain/repositories/services-repository.interface';

@Injectable({
    providedIn: 'root',
})
export class FetchServicesUseCase {
    private readonly repository = inject(ServicesRepository);

    execute(): Observable<ServicesEntity> {
        return this.repository.fetchServices();
    }
}
