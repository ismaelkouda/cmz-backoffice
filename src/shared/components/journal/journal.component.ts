import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { StatutTransaction } from "src/shared/enum/StatutTransaction.enum";
import { TraitementTransaction } from "src/shared/enum/TraitementTransaction.enum";
import { SettingService } from "src/shared/services/setting.service";

@Component({
  selector: "app-journal",
  templateUrl: "./journal.component.html",
  styleUrls: ["./journal.component.scss"],
})
export class JournalComponent implements OnInit {

  @Input() transaction;
  @Input() type;
  response: any;
  listJournal: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public stateSoumis: string = StatutTransaction.SOUMIS;
  public stateTraite: string = StatutTransaction.TARITER;
  public stateCloture: string = StatutTransaction.CLOTURER;
  public treatmenEntente: string = TraitementTransaction.EN_ENTENTE;
  public treatmenAcquiter: string = TraitementTransaction.ACQUITER;
  public treatmenAccepter: string = TraitementTransaction.ACCEPTER;
  public treatmenRejeter: string = TraitementTransaction.REJETER;
  public treatmenRefuser: string = TraitementTransaction.REFUSER;
  public treatmenCancel: string = TraitementTransaction.ABANDONNER;
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
        transaction: this.transaction.transaction,
      }).subscribe({
        next: (response) => {          
          this.listJournal =  response['data'].map((data) => {
            if (data?.statut === StatutTransaction.TARITER) {
              return {...data,user: data?.intervenant}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.ACQUITER)) {
              return {...data,user: data?.intervenant}
            }else if (data?.statut === StatutTransaction.CLOTURER) {
              return {...data,user: data?.demandeur}
            }else if ((data?.statut === StatutTransaction.SOUMIS) && (data?.traitement === TraitementTransaction.EN_ENTENTE)) {
              return {...data,user: data?.demandeur}
            }
          });          
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

}
