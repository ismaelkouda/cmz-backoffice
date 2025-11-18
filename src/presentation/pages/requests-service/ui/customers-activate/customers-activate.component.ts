import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, Subject, combineLatest, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { PageTitleComponent } from '../../../../../shared/components/page-title/page-title.component';
import { PaginationComponent } from '../../../../../shared/components/pagination/pagination.component';
import {
    TYPE_CUSTOMERS_ENUM,
    T_TYPE_CUSTOMERS_ENUM,
} from '../../../../../shared/enum/type-customers.enum';
import { CustomersActivateInterface } from '../../../../../shared/interfaces/customers-activate.interface';
import { MenuItem } from '../../../../../shared/interfaces/menu-item.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { EncodingDataService } from '../../../../../shared/services/encoding-data.service';
import { SharedService } from '../../../../../shared/services/shared.service';
import {
    CUSTOMERS_ACTIVATE_STATE_ENUM,
    T_CUSTOMERS_ACTIVATE_STATE_ENUM,
} from '../../data-access/customers-activate/enums/customers-activate-state.enum';
import {
    CUSTOMERS_ACTIVATE_STEP_ENUM,
    T_CUSTOMERS_ACTIVATE_STEP_ENUM,
} from '../../data-access/customers-activate/enums/customers-activate-step.enum';
import { CustomersActivateFilterInterface } from '../../data-access/customers-activate/interfaces/customers-activate-filter.interface';
import { CustomersActivatePageActionsType } from '../../data-access/customers-activate/types/customers-activate-page-actions.type';
import { REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM } from '../../data-access/requests-service/enums/requests-service-buttons-actions.enum';
import { FilterCustomersActivateComponent } from '../../feature/customers-activate/filter-customers-activate/filter-customers-activate.component';
import { TableCustomersActivateComponent } from '../../feature/customers-activate/table-customers-activate/table-customers-activate.component';
import { FORM, INVOICE, PAYMENT } from '../../requests-service-routing.module';

@Component({
    selector: 'app-customers-activate',
    standalone: true,
    templateUrl: './customers-activate.component.html',
    imports: [
        CommonModule,
        BreadcrumbComponent,
        PageTitleComponent,
        FilterCustomersActivateComponent,
        TableCustomersActivateComponent,
        PaginationComponent,
        TranslateModule,
    ],
})
export class CustomersActivateComponent implements OnInit, OnDestroy {
    public module = '';
    public subModule = '';
    public pagination$!: Observable<Paginate<CustomersActivateInterface>>;
    public listCustomersActivate$!: Observable<CustomersActivateInterface[]>;
    public spinner = true;
    private destroy$ = new Subject<void>();
    public listCustomersActivateStep: T_CUSTOMERS_ACTIVATE_STEP_ENUM[] =
        Object.values(CUSTOMERS_ACTIVATE_STEP_ENUM);
    public listCustomersActivateState: T_CUSTOMERS_ACTIVATE_STATE_ENUM[] =
        Object.values(CUSTOMERS_ACTIVATE_STATE_ENUM);
    private STORAGE_KEY!: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private sharedService: SharedService,
        private encodingService: EncodingDataService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][0];
        });
        this.listCustomersActivate$ = this.sharedService.getCustomersActivate();
        this.pagination$ = this.sharedService.getCustomersActivatePagination();

        combineLatest([
            this.sharedService.getDataFilterCustomersActivate(),
            this.sharedService.getDataNbrPageCustomersActivate(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.sharedService.fetchCustomersActivate(filterData, nbrPageData);
        });
        this.sharedService.isLoadingCustomersActivate().subscribe((spinner) => {
            this.spinner = spinner;
        });
        this.setupNavigationListener();
    }
    private setupNavigationListener(): void {
        const menuItems = this.encodingService.getData('menu') as
            | MenuItem[]
            | [];
        this.activatedRoute.url.pipe(takeUntil(this.destroy$)).subscribe(() => {
            const url = this.router.url.split('?')[0];
            for (const parent of menuItems) {
                if (parent.children) {
                    const child = parent.children.find((c) =>
                        url.startsWith(c.path)
                    );
                    if (child) {
                        this.STORAGE_KEY = child.path;
                        return;
                    }
                }
            }
        });
        console.log('this.STORAGE_KEY', this.STORAGE_KEY);
        const savedState = this.encodingService.getData(
            `${this.STORAGE_KEY}_children_component`
        );
        if (!savedState) {
            return;
        }
        // je fais pastienté cette methode que que la methode de tabs active soit appeler avant la methode de navigation ci-dessous
        setTimeout(() => {
            this.executeNavigation(
                savedState as CustomersActivatePageActionsType
            );
        }, 100);
    }
    public filter(filterData: CustomersActivateFilterInterface): void {
        this.sharedService.fetchCustomersActivate(filterData);
    }

    public onPageChange(event: number): void {
        this.sharedService
            .getDataFilterCustomersActivate()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.sharedService.fetchCustomersActivate(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public executeNavigation(params: CustomersActivatePageActionsType): void {
        if (!params.action) {
            return;
        }
        const number_demand = params.data ?? null;
        const ref = params.action;
        const type_enterprise: T_TYPE_CUSTOMERS_ENUM =
            TYPE_CUSTOMERS_ENUM.COMMERCIAL_ENTERPRISE;
        const queryParams = { ref, type_enterprise };

        const actionHandlers: Record<string, () => string> = {
            [REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.OPEN]: () =>
                `${number_demand}`,
            [REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.EDIT]: () => FORM,
            [REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.ADD]: () => FORM,
            [REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.PAYMENT]: () =>
                `${PAYMENT}/${number_demand}`,
            [REQUESTS_SERVICE_BUTTONS_ACTIONS_ENUM.INVOICE]: () =>
                `${INVOICE}/${number_demand}`,
        };

        const handler = actionHandlers[params.action];
        if (!handler) {
            console.warn('Action non gérée:', params.action);
            return;
        }

        const routePath = handler();
        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
        this.encodingService.saveData(
            `${this.STORAGE_KEY}_children_component`,
            params,
            true
        );
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
