import { ServiceEnum } from './../../../../../shared/enum/Service.enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';

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
  public currentRecaptcha: string;


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

  public siteKey: string;


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


  public currentId: any;


  constructor(
    private storage: EncodingDataService,
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,

  ) { }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    //this.numeroCommande = this.storage.getData('numero_commande');
    this.isFilter();
    this.GetAllServices()
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
      //SIMA
      {
        id: this.fiedlistA?.id,
        code_produit: this.fiedlistA?.code_produit,
        libelle_produit: this.fiedlistA?.libelle_produit,
        prix_unitaire: this.fiedlistA?.prix_unitaire,
        qte: this.selectedQtyBlanche,
        description: this.selectedDescBlanche
      },

      //SIMB
      {
        id: this.fiedlistB?.id,
        code_produit: this.fiedlistB?.code_produit,
        libelle_produit: this.fiedlistB?.libelle_produit,
        prix_unitaire: this.fiedlistB?.prix_unitaire,
        qte: this.selectedQtyMsimsdn,
        description: this.selectedDescSimMsisdn
      },
      //SIMC

      {
        id: this.fiedlistC?.id,
        code_produit: this.fiedlistC?.code_produit,
        libelle_produit: this.fiedlistC?.libelle_produit,
        prix_unitaire: this.fiedlistC?.prix_unitaire,
        qte: this.selectedvp,
        description: this.selectedDescVp
      },
    ];
    this.provisionningService
      .CreateProformatCommande({
        operation: "commande-produits",
        achats: data
      }).subscribe({
        next: (response) => {
          const data = response['data'][0];
          this.currentId = data?.id;
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
