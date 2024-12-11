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

type PageAction = { 'data': Object, 'action': 'détails', 'view': 'page' } | { 'data': Object, 'action': 'editer', 'view': 'page' } | { 'data': Object, 'action': 'identifer', 'view': 'page' };

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

  
  public filterData: Object;
  public currentPage: string;
  public selectedCarteSim: Object | null;

  constructor(public toastrService: ToastrService, private router: Router,
    private loadingBar: LoadingBarService, private patrimoinesService: PatrimoinesService,
    private carteSimStateService: CarteSimStateService, public mappingService: MappingService,
    private activatedRoute: ActivatedRoute, private carteSimApiStateService: CarteSimApiStateService) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit(): void {
    this.subscriptionListCartesSim = this.carteSimApiStateService.setListCartesSim().subscribe(() => {
      this.pageCallback({ statut: history?.state?.statut });
    });
    this.pageCallback({ statut: history?.state?.statut });
    this.activatedRoute.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
    // recuperation de la data du filtre et du numero de la page courrante lorsqu'on a fait un tour dans les details
    this.filterData = this.carteSimStateService.getFilterCarteSimState();
    console.log('this.filterData', this.filterData)
    this.currentPage = this.carteSimStateService.getCurrentPageCarteSimState();
    console.log('this.currentPage', this.currentPage)
    this.selectedCarteSim = this.carteSimStateService.getItemSelectedState();
    // si on a deja accedé, on recupere les donnees stocké dans "state" sinon on appele l'api
    this.spinner = true;
  }

  async pageCallback(dataToSend: Object = {}, nbrPage: string = "1") {
    const response: any = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllPage(dataToSend, nbrPage), this.toastrService, this.loadingBar);
    console.log('response', response)
    if (response.error === false) this.handleSuccessfulPageCallback(response);
  }

  private handleSuccessfulPageCallback(response: any): void {
    this.listCartesSim = response.data.data;
    this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
    console.log('this.pargination', this.pargination)
    console.log('response.data', response.data?.last_page)
    console.log('response.data?.last_page', response.data?.current_page)
    this.spinner = false;
  }

  public filter(filterData: Object): void {
      this.filterData = filterData;
      console.log('this.filterData', this.filterData)
      this.pageCallback(filterData);
  }

  public onPageChange(event: number) {
    console.log('event', event)
    this.pageCallback(this.filterData, JSON.stringify(event + 1))
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

  public navigateByUrl(params: PageAction): void {
    const id = params.data ? params.data["msisdn"] : null;
    const ref = params.action;
    const current_page = this.pargination?.["currentPage"] || 1;
    const filter = this.carteSimStateService?.setFilterCarteSimState(this.filterData) ?? null;
    const queryParams = {ref,current_page,filter};
    let routePath: string = id;
    // switch (params.action) {case "détails":routePath = `${id}`;break;}
    this.router.navigate([routePath], { relativeTo: this.activatedRoute, queryParams });
  }

  ngOnDestroy(): void {
      // reinitialiser les données de tout les etats
      this.carteSimStateService.clearCarteSim();
  }
}