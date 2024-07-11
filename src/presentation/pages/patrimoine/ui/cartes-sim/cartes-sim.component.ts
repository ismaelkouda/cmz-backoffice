import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import { handle } from "src/shared/functions/api.function";
import { PatrimoinesService } from "src/presentation/pages/patrimoine/data-access/patrimoines.service";
import { Pargination } from "src/shared/table/pargination";
import { MappingService } from 'src/shared/services/mapping.service';
import { SEARCH } from 'src/shared/routes/routes';
import { filter, Subscription } from 'rxjs';
import { CarteSimApiStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-api-state.service';
import { CARTES_SIM } from 'src/presentation/pages/patrimoine/patrimoine-routing.module';

type TYPEPARAMURL = "editer" | "details";
@Component({
  selector: "app-cartes-sim",
  templateUrl: "./cartes-sim.component.html",
})

export class CartesSimComponent implements OnInit, OnDestroy {
  private subscriptionRouter: Subscription;
  private subscriptionListCartesSim: Subscription;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
  public module: string;
  public subModule: string;
  private response: any = {};
  public listCartesSim: Array<Object>;
  public spinner: boolean = false;

  constructor(public toastrService: ToastrService, private router: Router,
    private loadingBar: LoadingBarService, private patrimoinesService: PatrimoinesService,
    private carteSimStateService: CarteSimStateService, public mappingService: MappingService,
    private activatedRoute: ActivatedRoute, private carteSimApiStateService: CarteSimApiStateService) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnDestroy(): void {
    if (this.subscriptionListCartesSim) this.subscriptionListCartesSim.unsubscribe();
  }

  ngOnInit(): void {
    this.initPage();
    // si on a deja accedé, on recupere les donnees stocké dans "state" sinon on appele l'api
    if (this.carteSimStateService.getTableState()) {
      this.listCartesSim = this.carteSimStateService.getTableState();
      this.pargination = this.carteSimStateService.getParginateState();
    } else {
      this.subscriptionListCartesSim = this.carteSimApiStateService.setListCartesSim().subscribe(() => {
        this.pageCallback({ statut: history?.state?.statut });
      });
      this.pageCallback({ statut: history?.state?.statut });
      this.spinner = true;
    }
  }

  async pageCallback(dataToSend: Object = {}, nbrPage: number = 1) {
    this.response = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllPage(dataToSend, nbrPage), this.toastrService, this.loadingBar);
    this.carteSimStateService.setFilterState(dataToSend);
    this.handleSuccessfulPageCallback(this.response);
  }

  private handleSuccessfulPageCallback(response): void {
    this.listCartesSim = response.data.data;
    this.carteSimStateService.setTableState(this.listCartesSim);
    this.carteSimStateService.setFilterState(null);
    this.carteSimStateService.setTableItemSelectedState(null);
    this.spinner = false;
    this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
    this.carteSimStateService.setParginateState(this.pargination);
  }

  public onPageChange(event: number) {
    this.pageCallback(this.carteSimStateService.getFilterState(), event + 1);
  }

  public navigateByUrl(data: { data: null | Object, paramUrl: TYPEPARAMURL }): void {
    this.openOtherViewEquipeAdv(data);
  }
  private openOtherViewEquipeAdv(data: { data: null | Object, paramUrl: TYPEPARAMURL }): void {
    this.router.navigate([SEARCH], { relativeTo: this.activatedRoute, queryParams: { view: data.paramUrl, id: data.data["id"], currentPage: this.pargination.currentPage } });
  }

  public exportExcel(): void {
    //   const data = this.listCartesSim.map((item: any) => ({
    //     [this.firstLevelLibelle]: item?.niveau_uns_nom,
    //     [this.secondLevelLibelle]: item?.niveau_deux_nom,
    //     'Zone Trafic': item?.adresse_geographique,
    //     [this.thirdLevelLibelle]: item?.niveau_trois_nom,
    //     'MSISDN': item?.msisdn,
    //     'IMSI': item?.imsi,
    //     'Emplacement': item?.point_emplacement,
    //     'Statut Contrat': item?.statut
    //   }));
    //   this.excelService.exportAsExcelFile(data, 'Liste des cartes SIM');
  }

  private resetState(): void {
    this.carteSimStateService.setFilterState(null);
    this.carteSimStateService.setParginateState(null);
    this.carteSimStateService.setTableItemSelectedState(null);
    this.carteSimStateService.setTableState(null);
    this.subscriptionRouter.unsubscribe();
  }

  private initPage(): void {
    this.subscriptionRouter = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!event.urlAfterRedirects.includes('cartes-sim')) {
        this.resetState();
      }
    });
    this.activatedRoute.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
  }
}