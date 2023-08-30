import { ServiceEnum } from './../../../../../shared/enum/Service.enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
  public selectedQtyBlanche: number = 0;
  public selectedDescBlanche: string;
  public selectedQtyMsimsdn: number = 0;
  public selectedDescSimMsisdn: string;
  public selectedvp: number = 0;
  public selectedDescVp: string;
  public currentId: any;
  public panierList: Array<any> = []
  public listProducts: Array<any> = []
  public currentItem: any;

  public displays: boolean = false;
  constructor(
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,
    private loadingBar: LoadingBarService,
    private modalService: NgbModal


  ) {
    this.listProducts = [
      {
        id: 1,
        nom: 'product A',
        prix: 1000,
        code: 'IMA-05A',
        qty: 1
      },
      {
        id: 2,
        nom: 'product B',
        prix: 20000,
        code: 'IMA-05B',
        qty: 1
      },
      {
        id: 3,
        nom: 'product C',
        prix: 5000,
        code: 'IMA-05C',
        qty: 1
      },
      {
        id: 4,
        nom: 'product D',
        prix: 5000,
        code: 'IMA-05D',
        qty: 1
      },
      {
        id: 5,
        nom: 'product E',
        prix: 5000,
        code: 'IMA-05E',
        qty: 1
      }
    ]
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.isFilter();
    this.GetAllServices();
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
          // this.listProducts = response['data']
          this.fiedlistA = response['data'][0]; //Blanche
          this.fiedlistB = response['data'][1]; //MSISNDN
          this.fiedlistC = response['data'][2]; // Vol
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }

  OnModal(item: any, content: any) {
    this.modalService.open(content);
    const panierIdList = [];
    this.panierList.map(element => {
      panierIdList.push(element?.id)
    });
    if (!panierIdList.includes(item?.id)) {
      console.log("111111111111111111111");
      this.currentItem = { ...item, qty: 1 };
    } else {
      console.log("222222222222222222222");

      this.currentItem = item;
    }
  }
  hideModal() {
    this.modalService.dismissAll();
  }

  addToPanier(data: any) {
    let findProduct = this.panierList.find((it) => it.id === data.id);
    if (findProduct === undefined) {
      this.panierList.push(data);
    } else {
      findProduct.qty = this.currentItem?.qty;
    }
    this.hideModal()
  }
  incrementButton(data: any) {
    let findProduct = this.panierList.find((it) => it.id === data.id);
    if (findProduct === undefined) {
      this.panierList.push(data);
    } else {
      findProduct.qty += 1;
    }
  }
  decrementButton(data: any) {
    if (data.qty <= 1) {
      return;
    } else {
      data.qty -= 1;
    }
  }
  RemoveFromPanier(data: any) {
    this.panierList.forEach((value, index) => {
      if (value == data) {
        this.panierList.splice(index, 1);
      }
      const sliceProduct = this.listProducts[index];
      if (this.panierList.length === 0) {
        this.displays = false;
      }
    });
  }

  totalProduct() {
    var totale = 0;
    this.panierList.forEach((item: any) => {
      totale += item.qty;
    });
    return totale;
  }

  totalPrice() {
    var total = 0;
    this.panierList.forEach((item: any) => {
      total += item.prix * item.qty;
    });
    return total;
  }

  montantRemise() {
    let totalPriceValue: any = this.totalPrice();
    return totalPriceValue * (18 / 100);
  }
  montantTotal() {
    let valueTotalPrice: any = this.totalPrice();
    let valueTotalRemise: any = this.montantRemise();
    return valueTotalPrice + valueTotalRemise;
  }

  public CreateProformatCommande() {
    this.showFacture();
  }

  showFacture() {
    this.loadingBar.start();
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
    this.initialView = false;
    this.factureView = true;
    this.currentObjectTwo = data;

    console.log("data", data);

    setTimeout(() => {
      this.loadingBar.stop();
    }, 500);
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
  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  public isFilter(): boolean {
    return (!this.selectedQtyBlanche && !this.selectedQtyMsimsdn && !this.selectedvp) ? true : false
  }
}
