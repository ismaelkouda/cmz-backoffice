import { ServiceEnum } from './../../../../../shared/enum/Service.enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-commande-form',
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.scss']
})
export class CommandeFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listCommandes = new EventEmitter();
  @Output() formsView = new EventEmitter();
  public initialView: boolean = true;
  public factureView: boolean = false;
  public currentObjectTwo: any;
  public display: boolean = false;
  public isMaximized: boolean = false;
  public numeroCommande: string;
  public selectedDescription: string;
  public selectedCountSim: string;


  //Operations Transaction
  public operationValue: string = OperationTransaction.ACTIVATION;
  public activation: string = OperationTransaction.ACTIVATION;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public swap: string = OperationTransaction.SWAP;
  public volumeData: string = OperationTransaction.VOLUME_DATA;


  //Type Services
  public airtimeService: string = ServiceEnum.AIRTIME;
  public dataService: string = ServiceEnum.DATA;
  public smsService: string = ServiceEnum.SMS;

  //Type SIM
  public typeSimBlanche: string = 'sim_blanche';
  public typeSimMsisdn: string = 'sim_msisdn';
  public selectedTypeSim: string = this.typeSimBlanche;

  public selectedCodeb: string;
  public selectedCodea: string;
  public selectedVol: string;



  fiedlistA: any = {};
  fiedlistB: any = {};
  fiedlistC: any = {};

  //Forms Model

  public selectedQtyBlanche: number;
  public selectedDescBlanche: string;
  public selectedQtyMsimsdn: number;
  public selectedDescSimMsisdn: string;
  public selectedvp: number;
  public selectedDescVp: string;



  constructor(
    private storage: EncodingDataService,
    private provisionningService: ProvisionningService,
    private toastService: ToastrService

  ) { }

  ngOnInit() {
    this.numeroCommande = this.storage.getData('numero_commande');
    // if (this.currentObject?.show) {
    //   this.selectedQtySimb = this.currentObject?.qte_sim_blanche;
    //   this.selectedDescSimb = this.currentObject?.description_sim_blanche,
    //     this.selectedQtySima = this.currentObject?.qte_sim_msisdn;
    //   this.selectedDescSima = this.currentObject?.description_sim_msisdn;
    //   this.selectedvp = this.currentObject?.volume_data
    // }
    this.isFilter();
    this.GetAllServices()
    console.log("currentObject", this.currentObject);
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public selectedAction(value: string) {

  }

  public GetAllServices() {
    this.provisionningService
      .GetAllServices({})
      .subscribe({
        next: (response) => {
          console.log("responseee", response);
          this.fiedlistA = response['data'][0]; //Blanche
          this.fiedlistB = response['data'][1]; //MSISNDN
          this.fiedlistC = response['data'][2]; // Vol
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }
  public CreateProformatCommande() {
    const data = [
      { ...this.fiedlistA, qte_sim_blanche: this.selectedQtyBlanche, description_sim_blanche: this.selectedDescBlanche },
      { ...this.fiedlistB, qte_sim_msisdn: this.selectedQtyMsimsdn, description_sim_msisdn: this.selectedDescSimMsisdn },
      { ...this.fiedlistA, qte_sim_blanche: this.selectedvp }
    ]
    this.provisionningService
      .CreateProformatCommande({
        numero_commande: this.numeroCommande,
        operation: "commande-produits",
        achats: data
      }
        // numero_commande: this.numeroCommande,
        // qte_sim_blanche: this.selectedQtyBlanche,
        // description_sim_blanche: this.selectedDescBlanche,
        // qte_sim_msisdn: this.selectedQtyMsimsdn,
        // description_sim_msisdn: this.selectedDescSimMsisdn,
        // volume_data: this.selectedvp,
        // operation: this.selectedDescVp
      )
      .subscribe({
        next: (response) => {
          this.showFacture();
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }
  showFacture() {
    this.initialView = false;
    this.factureView = true;
    this.currentObject = undefined;
  }

  public hideFacture(data) {
    this.display = false;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  public pushStatutView(event: any): void {
    this.factureView = event?.statut;
    this.initialView = !event?.statut;
    if (event?.type === 'fermer') {
      this.close()
    }
  }

  public isFilter(): boolean {
    return (!this.selectedQtyBlanche && !this.selectedQtyMsimsdn && !this.selectedvp) ? true : false
  }
}
