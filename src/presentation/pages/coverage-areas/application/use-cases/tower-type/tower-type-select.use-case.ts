import { inject, Injectable } from '@angular/core';
import { TowerTypeSelectRepository } from '@pages/coverage-areas/domain/repositories/tower-type/tower-type-select.repository';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TowerTypeSelectUseCase {
    private readonly repository = inject(TowerTypeSelectRepository);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return defer(() => this.repository.readAll(options));
    }
}
