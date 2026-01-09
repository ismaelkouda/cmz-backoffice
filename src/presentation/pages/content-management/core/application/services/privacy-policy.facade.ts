import { inject, Injectable } from '@angular/core';
import { CreatePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/create-privacy-policy.use-case';
import { DeletePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/delete-privacy-policy.use-case';
import { GetPrivacyPolicyByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/get-privacy-policy-by-id.use-case';
import { FetchPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/privacy-policy.use-case';
import { PublishPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/publish-privacy-policy.use-case';
import { UnpublishPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/unpublish-privacy-policy.use-case';
import { UpdatePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/update-privacy-policy.use-case';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/core/domain/entities/privacy-policy.entity';
import { PrivacyPolicyFilter } from '@presentation/pages/content-management/core/domain/value-objects/privacy-policy-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { GetPrivacyPolicyByIdEntity } from '../../domain/entities/get-privacy-policy-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFacade extends BaseFacade<PrivacyPolicyEntity, PrivacyPolicyFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchPrivacyPolicyUseCase);
    private readonly createUseCase = inject(CreatePrivacyPolicyUseCase);
    private readonly updateUseCase = inject(UpdatePrivacyPolicyUseCase);
    private readonly getByIdUseCase = inject(GetPrivacyPolicyByIdUseCase);
    private readonly deleteUseCase = inject(DeletePrivacyPolicyUseCase);
    private readonly publishUseCase = inject(PublishPrivacyPolicyUseCase);
    private readonly unpublishUseCase = inject(UnpublishPrivacyPolicyUseCase);

    readonly privacyPolicy$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchPrivacyPolicy(filter: PrivacyPolicyFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);

        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);

        this.fetchWithFilterAndPage(null, firstPage, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    getById(id: string): Observable<GetPrivacyPolicyByIdEntity> {
        return this.getByIdUseCase.execute(id);
    }

    create(payload: FormData) {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    update(id: string, payload: FormData) {
        return this.handleActionWithRefresh(this.updateUseCase.execute({ id, params: payload }), 'COMMON.SUCCESS.UPDATE');
    }

    delete(id: string) {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }

    publish(id: string) {
        return this.handleActionWithRefresh(this.publishUseCase.execute(id), 'COMMON.SUCCESS.PUBLISH');
    }

    unpublish(id: string) {
        return this.handleActionWithRefresh(this.unpublishUseCase.execute(id), 'COMMON.SUCCESS.UNPUBLISH');
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }
}
