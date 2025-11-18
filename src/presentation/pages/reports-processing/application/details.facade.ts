import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { ToastrService } from 'ngx-toastr';
import { DetailsEntity } from '../domain/entities/details/details.entity';
import { FetchDetailsUseCase } from '../domain/use-cases/details.use-case';

@Injectable({
    providedIn: 'root',
})
export class DetailsFacade extends BaseFacade<DetailsEntity, void> {
    readonly details$ = this.itemsDetails$;

    constructor(
        private readonly fetchDetailsUseCase: FetchDetailsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);

        this.loadingDetails$.subscribe((loading) => {
            console.log('🔄 DetailsFacade loading state:', loading);
        });
    }

    fetchDetails(id: string): void {
        const fetch$ = this.fetchDetailsUseCase.execute(id);
        this.fetchDataDetails(fetch$);
    }
}
