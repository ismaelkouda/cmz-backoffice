import { inject, Injectable } from '@angular/core';
import { InfrastructureSelectRepository } from '@presentation/pages/administrative-infrastructure/domain/repositories/infrastructure/infrastructure-select.repository';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class InfrastructureSelectUseCase {
    private readonly repository = inject(InfrastructureSelectRepository);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return defer(() => this.repository.readAll(options));
    }
}
