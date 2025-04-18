import { PatrimoinesService } from './../../data-access/patrimoines.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable } from 'rxjs';
import { SharedService } from '../../../../../shared/services/shared.service';
import {
    BADGE_ETAPE,
    T_BADGE_ETAPE,
} from '../../../../../shared/constants/badge-etape.constant';
import {
    BADGE_ETAT,
    T_BADGE_ETAT,
} from '../../../../../shared/constants/badge-etat.contant';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const etat_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction =
    | { data: Object; action: 'détails'; view: 'page' }
    | { data: Object; action: 'editer'; view: 'page' }
    | { data: Object; action: 'identifer'; view: 'page' };

@Component({
    selector: 'app-cartes-sim',
    templateUrl: './cartes-sim.component.html',
})
export class CartesSimComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination: Paginate<any> | void;
    public filterData: any;
    public currentPage: string;
    public listStepSimCard: Array<T_BADGE_ETAPE> = step_values;
    public listStateSimCard: Array<T_BADGE_ETAT> = etat_values;
    public listSimCard$: Observable<any[]>;
    public simCardSelected$: Observable<any>;
    public listApplicants$: Observable<any[]>;

    constructor(
        public toastrService: ToastrService,
        private router: Router,
        private patrimoinesService: PatrimoinesService,
        private activatedRoute: ActivatedRoute,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.pageCallback();
        this.sharedService.fetchApplicants({});
        this.listApplicants$ = this.sharedService.getApplicants();
        this.patrimoinesService.getSimsPagination().subscribe((value) => {
            this.pagination = value;
        });
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
    }

    public pageCallback(): void {
        this.listSimCard$ = this.patrimoinesService.getSims();
        this.simCardSelected$ = this.patrimoinesService.getSimsSelected();
        combineLatest([
            this.patrimoinesService.getDataFilterSims(),
            this.patrimoinesService.getDataNbrPageSims(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.patrimoinesService.fetchSims(
                { statut: history?.state?.statut, filterData },
                nbrPageData
            );
        });
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.patrimoinesService.fetchSims(filterData);
    }

    public onPageChange(event: number) {
        this.patrimoinesService.fetchSims(
            this.filterData,
            JSON.stringify(event + 1)
        );
    }

    public navigateByUrl(params: PageAction): void {
        const id = params.data ? params.data['msisdn'] : null;
        const ref = params.action;
        const queryParams = { ref };
        let routePath: string = id;
        this.router.navigate([routePath], {
            relativeTo: this.activatedRoute,
            queryParams,
        });
    }
}
