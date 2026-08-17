import { inject, Injectable } from '@angular/core';
import { SiteGroupSelectRepository } from '@pages/coverage-areas/domain/repositories/site-group/site-group-select.repository';
import { SelectOption } from '@shared/domain/interfaces/select-option.interface';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SiteGroupSelectUseCase {
    private readonly repository = inject(SiteGroupSelectRepository);

    readAll(options?: FetchOptions): Observable<SelectOption[]> {
        return defer(() => this.repository.readAll(options));
    }
}
