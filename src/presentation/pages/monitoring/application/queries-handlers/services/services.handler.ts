import { Injectable, inject } from '@angular/core';
import { ServicesUseCase } from '@pages/monitoring/application/use-cases/services/services.use-case';
import { ServicesEntity } from '@pages/monitoring/domain/entities/services/services.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ServicesHandler {
    private readonly useCase = inject(ServicesUseCase);

    execute(): Observable<ServicesEntity> {
        return this.useCase.execute();
    }
}
