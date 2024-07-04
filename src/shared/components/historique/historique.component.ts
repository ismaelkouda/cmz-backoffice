import { SettingService } from "src/shared/services/setting.service";
import { Component, Input, OnInit } from "@angular/core";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { ToastrService } from "ngx-toastr";
import * as moment from "moment";
import { handle } from 'src/shared/functions/api.function';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ExcelService } from "src/shared/services/excel.service";

@Component({
  selector: "app-historique",
  templateUrl: "./historique.component.html",
  styleUrls: ["./historique.component.scss"],
})
export class HistoriqueComponent implements OnInit {
  public formFilter: FormGroup;
  @Input() module: string;
  @Input() sous_module: string;
  @Input() modele: string;
  @Input() modele_id: any;
  @Input() modele_type: any;

  public listUsers: Array<any>;
  public exportList: Array<any>;
  public listHistoriques: Array<any>;

  public filterDateEnd: Date;
  public selectDateEnd: any;

  public currentEventParseBeforeKeys: Array<any> = [];
  public currentEventParseBeforeValues: Array<any> = [];
  public currentEventParseAfterValues: Array<any> = [];
  public currentEventParseAfter: Array<any> = [];
  // public filterDateStart: Date;
  // public selectDateStart: any;
  public currentEvent: any;
  public currentEventParse;
  public display: boolean = false;
  public isMaximized: boolean = false;
  private response: any;

  constructor(
    private loadingBar: LoadingBarService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private fb: FormBuilder,
    private excelService: ExcelService
  ) {}

  ngOnInit(): void {
    this.initFormFilter();
    this.getAllUsers();
    this.pageCallback();
  }
  private initFormFilter() {
    this.formFilter = this.fb.group({
      date_debut: [""],
      date_fin: [""],
      user_id: [],
    });
  }
  async getAllUsers(dataToSend: Object = {}): Promise<any> {
    this.response = await handle(
      () => this.settingService.getAllUsers(dataToSend),
      this.toastrService,
      this.loadingBar
    );
    this.listUsers = this.response?.data.map((user: any) => {
      return {
        ...user,
        fullName: `[${user.matricule}] ${user.nom} ${user.prenoms}`,
      };
    });
  }
  async pageCallback() {
    const dataToSend = {module: this.module,sous_module: this.sous_module,modele: this.modele,modele_id: this.modele_id,...this.formFilter.value,};
    this.response = await handle(() => this.settingService.getHistoriques(dataToSend), this.toastrService,this.loadingBar);
    if (this.response?.data) this.handleGetAllHistoriques(this.response);
  }

  private handleGetAllHistoriques(response: any): void {
    this.listHistoriques = response?.data;
    // this.exportList = response?.data.map((el) => { return { SourceUtilisteur: el.ip + "[" + el.nom + " " + el.prenoms + "]", Module: el.module, sousModule: el.sous_module, action: el.action, date: el.created_at}});
  }

  public OnExportExcel(): void {
    const data = this.listHistoriques.map((historique) => ({
      "Date": historique?.created_at,
      "Operation": historique?.event,
      "Détails Operation": historique?.action,
      "Source [Utilisateur]": `${historique?.ip} ${historique?.user} ${historique?.user?.nom} ${historique?.user?.prenoms}`
    }) as const);
    this.excelService.exportAsExcelFile(data, "Liste des historique Account Managers");
  }

  showHistorique(historique: any) { 
      if (historique?.event === "Mise à jour" || historique?.event === "Évènement") {
        this.currentEventParse = JSON.parse(historique?.data);
        if (this.currentEventParse?.before && this.currentEventParse?.after) {
          Object.values(this.currentEventParse.before).map((value: any, i) => {
              this.currentEventParseBeforeValues.push(value);
            this.currentEventParseBeforeKeys.push(
              Object.keys(this.currentEventParse.before)[i]
            );
            this.currentEventParseAfter.push(
              Object.values(this.currentEventParse.after)[i] 
            );
            this.currentEventParseAfterValues = this.currentEventParseAfter.map(
              (item, index) => {
                if(item && typeof(item) === 'object') {
                  if (item.id === this.currentEventParseBeforeValues[index].id) {
                    return { item, isIdentique: true };
                  } else {
                    return { item, isIdentique: false };
                  }
                } else {
                  if (item === this.currentEventParseBeforeValues[index]) {
                    return { item, isIdentique: true };
                  } else {
                    return { item, isIdentique: false };
                  }
                }
              }
            );
          });
        }
      }
      this.display = true;
      this.currentEvent = historique;
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  hideDialog() {
    this.display = false;
  }
  // refreshHistorique() {
  //   this.settingService.statutSubject$.subscribe((response: any) => {
  //     if (response === true) {
  //       this.getAllHistoriques();
  //     }
  //   });
  // }

  // changeDateStart(e) {
  //   // this.selectDateStart = moment(this.filterDateStart).format("YYYY-MM-DD");
  // }
  // changeDateEnd(e) {
  //   // this.selectDateEnd = moment(this.filterDateEnd).format("YYYY-MM-DD");
  // }

  // filterHistoriques() {
  //   if (moment(this.formFilter.get('date_debut').value).isAfter(moment(this.formFilter.get('date_fin').value))) {
  //     this.toastService.error("Plage de date invalide");
  //     return;
  //   }
  //   this.getAllHistoriques();
  // }
}
