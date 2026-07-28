import { inject, Injectable } from '@angular/core';
import { FiberConstructorSelectRepository } from '@pages/coverage-areas/domain/repositories/fiber-constructor/fiber-constructor-select.repository';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FiberConstructorSelectUseCase {
    private readonly repository = inject(FiberConstructorSelectRepository);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return defer(() => this.repository.readAll(options));
    }
}
