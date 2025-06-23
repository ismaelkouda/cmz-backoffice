import {
    IMPORTATION_STEP,
    T_IMPORTATION_STEP,
} from './../../data-access/importation/enums/importation-step.constant';
import { Folder } from '../../../../../shared/interfaces/folder';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../shared/services/shared.service';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from '../../../../../shared/constants/badge-etat.contant';
import { FORM, INVOICE, PAYMENT } from '../../requests-services-routing.module';
import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';
import { ImportationFilterInterface } from '../../data-access/importation/interface/importation-filter.interface';

// const step_values = [
//     BADGE_ETAPE.SOUMISSION,
//     BADGE_ETAPE.TRAITEMENT,
//     BADGE_ETAPE.FINALISATEUR,
//     BADGE_ETAPE.CLOTURE,
// ];
const step_values = [
    IMPORTATION_STEP.IN_WAITING,
    IMPORTATION_STEP.PARTIAL,
    IMPORTATION_STEP.COMPLETE,
];
const state_values = [
    BADGE_ETAT.RECU,
    BADGE_ETAT.EN_COURS,
    BADGE_ETAT.TERMINE,
    BADGE_ETAT.EN_ATTENTE,
    BADGE_ETAT.ABANDONNE,
    BADGE_ETAT.ACCEPTE,
    BADGE_ETAT.REJETE,
];
type PageAction = {
    data: Folder;
    action:
        | 'open-folder-importation'
        | 'mass-edit-importation'
        | 'simple-add-importation'
        | 'mass-add-importation'
        | 'payment-importation'
        | 'invoice-importation';
    view: 'page';
};

@Component({
    selector: 'app-importation',
    templateUrl: './importation.component.html',
})
export class ImportationComponent {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<Folder>>;
    public listStepFolder: Array<T_IMPORTATION_STEP> = step_values;
    public listStateFolder: Array<T_BADGE_ETAT> = state_values;
    public listApplicants$: Observable<Array<ApplicantInterface>>;
    public listDemands$: Observable<Array<Folder>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private router: Router,
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[5];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listDemands$ = this.sharedService.getDemandsImported();
        this.pagination$ = this.sharedService.getDemandsImportedPagination();
        combineLatest([
            this.sharedService.getDataFilterDemandsImported(),
            this.sharedService.getDataNbrPageDemandsImported(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.sharedService.fetchDemandsImported(filterData, nbrPageData);
        });
        this.sharedService
            .isLoadingDemandsImported()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: ImportationFilterInterface): void {
        this.sharedService.fetchDemandsImported({
            ...filterData,
            operation: OperationTransaction.IMPORTATION,
        });
    }

    public onPageChange(event: number): void {
        this.sharedService
            .getDataFilterDemandsImported()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.sharedService.fetchDemandsImported(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    public navigateByUrl(params: PageAction): void {
        const number_demand = params.data
            ? params.data['numero_demande']
            : null;
        const ref = params.action;
        const operation = OperationTransaction.IMPORTATION;
        const queryParams = { ref };
        let routePath: string = '';

        switch (params.action) {
            case 'open-folder-importation':
                routePath = `${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
            case 'mass-edit-importation':
            case 'simple-add-importation':
                routePath = FORM;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams: {
                        ...queryParams,
                        operation: OperationTransaction.IMPORTATION,
                    },
                });
                break;
            case 'mass-add-importation':
                routePath = FORM;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams: {
                        ...queryParams,
                        operation: OperationTransaction.IMPORTATION_EN_MASSE,
                    },
                });
                break;
            case 'payment-importation':
                routePath = `${PAYMENT}/${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
            case 'invoice-importation':
                routePath = `${INVOICE}/${number_demand}`;
                this.router.navigate([routePath], {
                    relativeTo: this.activatedRoute,
                    queryParams,
                });
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
