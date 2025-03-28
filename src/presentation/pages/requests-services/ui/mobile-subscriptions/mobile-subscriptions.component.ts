import { Folder } from '../../../../../shared/interfaces/folder';
import { Paginate } from './../../../../../shared/interfaces/paginate';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../../shared/services/shared.service';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BADGE_ETAPE, T_BADGE_ETAPE } from '../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT, T_BADGE_ETAT } from '../../../../../shared/constants/badge-etat.contant';
import { FORM, INVOICE } from '../../requests-services-routing.module';
import { OperationTransaction } from '../../../../../shared/enum/OperationTransaction.enum';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';
import { mobileSubscriptionsFilterInterface } from '../../data-access/mobile-subscriptions/interface/mobile-subscription-filter.interface';

const step_values = [BADGE_ETAPE.SOUMISSION, BADGE_ETAPE.TRAITEMENT];
const state_values = [BADGE_ETAT.RECU, BADGE_ETAT.EN_COURS, BADGE_ETAT.TERMINE];
type PageAction = { data: Folder, action: 'open-folder-mobile-subscription' | 'invoice-mobile-subscription' | 'mass-edit-mobile-subscription' | 'simple-add-mobile-subscription' | 'mass-add-mobile-subscription', view: 'page' };

@Component({
  selector: 'app-mobile-subscriptions',
  templateUrl: './mobile-subscriptions.component.html',
  styleUrls: ['./mobile-subscriptions.component.scss']
})
export class MobileSubscriptionsComponent {

  public module: string;
  public subModule: string;
  public pagination$: Observable<Paginate<Folder>>;
  public listStepFolder: Array<T_BADGE_ETAPE> = step_values;
  public listStateFolder: Array<T_BADGE_ETAT> = state_values;
  public listApplicants$: Observable<Array<ApplicantInterface>>;
  public listDemands$: Observable<Array<Folder>>;
  public spinner: boolean = true;
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private sharedService: SharedService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[1];
    });
    this.sharedService.fetchApplicants();
    this.listApplicants$ = this.sharedService.getApplicants();
    this.listDemands$ = this.sharedService.getDemands();
    this.pagination$ = this.sharedService.getDemandsPagination();
    combineLatest([
      this.sharedService.getDataFilterDemands(),
      this.sharedService.getDataNbrPageDemands()
    ]).subscribe(([filterData, nbrPageData]) => {
      this.sharedService.fetchDemands({ ...filterData, operation: OperationTransaction.ACTIVATION }, nbrPageData);
    });
    this.sharedService.isLoadingDemands().pipe(takeUntil(this.destroy$)).subscribe((spinner: boolean) => {
        this.spinner = spinner;
    });
  }

  public filter(filterData: mobileSubscriptionsFilterInterface): void {
    this.sharedService.fetchDemands({ ...filterData, operation: OperationTransaction.ACTIVATION })
  }

  public onPageChange(event: number): void {
    this.sharedService.getDataFilterDemands().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
        this.sharedService.fetchDemands(filterData, JSON.stringify(event + 1))
    });
  }

  public navigateByUrl(params: PageAction): void {
    const number_demand = params.data ? params.data["numero_demande"] : null;
    const ref = params.action;
    const operation = OperationTransaction.ACTIVATION;
    const queryParams = { ref, operation };
    let routePath: string = '';

    switch (params.action) {
      case "invoice-mobile-subscription": routePath = `${INVOICE}/${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
      case "open-folder-mobile-subscription": routePath = `${number_demand}`; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams }); break;
      case "mass-edit-mobile-subscription":
      case "simple-add-mobile-subscription": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION } }); break;
      case "mass-add-mobile-subscription": routePath = FORM; this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams: { ...queryParams, operation: OperationTransaction.ACTIVATION_EN_MASSE } }); break;
    }
  }

  ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
  }

}