import { Injectable, inject } from '@angular/core';
import { ServicesEntity } from '@pages/monitoring/domain/entities/services/services.entity';
import { ServicesRepository } from '@pages/monitoring/domain/repositories/services-repository.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServicesUseCase {
    private readonly repository = inject(ServicesRepository);

    execute(options?: FetchOptions): Observable<ServicesEntity> {
        return this.repository.fetchServices(options);
    }
}
