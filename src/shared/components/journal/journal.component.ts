import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { BADGE_ETAPE } from "src/shared/constants/badge-etape.constant";
import { BADGE_ETAT } from "src/shared/constants/badge-etat.contant";
import { BADGE_TRAITEMENT } from "src/shared/constants/badge-traitement.constant";
import { BADGE_STATUT } from "src/shared/constants/badge-statut.constant";
import { StatutTransaction } from "src/shared/enum/StatutTransaction.enum";
import { TraitementTransaction } from "src/shared/enum/TraitementTransaction.enum";
import { SettingService } from "src/shared/services/setting.service";

@Component({
  selector: "app-journal",
  templateUrl: "./journal.component.html",
  styleUrls: ["./journal.component.scss"],
})
export class JournalComponent implements OnInit {
  public BADGE_ETAT = BADGE_ETAT;
  public BADGE_ETAPE = BADGE_ETAPE;
  public BADGE_TRAITEMENT = BADGE_TRAITEMENT;
  public BADGE_STATUT = BADGE_STATUT;
  @Input() typeJournal: "demandes-services" | "transactions";
  @Input() transaction: string;
  @Input() numero_demande: string;
  response: any;
  listJournal: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  constructor(
    private activeModal: NgbActiveModal,
    private settingsService: SettingService,
    private toastrService: ToastrService
  ) { }

  /**
   * @author André ATCHORI
   */

  ngOnInit() {
    this.getAllJournal();
  }

  closeModal() {
    this.activeModal.close();
  }

 public  getAllJournal() {  
    this.settingsService
      .getAllJournal({
        transaction: this.transaction,
        numero_demande: this.numero_demande,
      }, this.typeJournal)
      .subscribe({
        next: (response) => {          
          this.listJournal =  response['data']
          // .map((data) => {
          //   if (data?.statut === StatutTransaction.TARITER) {
          //     return {...data,user: data?.intervenant}
          //   }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
          //     return {...data,user: data?.intervenant}
          //   }else if (data?.statut === StatutTransaction.CLOTURER) {
          //     return {...data,user: data?.demandeur}
          //   }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.EN_ENTENTE)) {
          //     return {...data,user: data?.demandeur}
          //   }
          // });          
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

}
