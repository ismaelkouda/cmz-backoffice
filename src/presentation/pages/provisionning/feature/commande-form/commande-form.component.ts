import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.prod';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var require;
const Swal = require("sweetalert2");

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
  public display: boolean = false;
  public isMaximized: boolean = false;
  public selectedDescription: string;
  public siteKey: string;

  //Operations Transaction
  public activation: string = OperationTransaction.ACTIVATION;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public swap: string = OperationTransaction.SWAP;

  //Forms Model
  public selectedQtyBlanche: number = 0;
  public selectedQtyMsimsdn: number = 0;
  public selectedvp: number = 0;
  public panierList: Array<any> = []
  public listProducts: Array<any> = []
  public currentItem: any;

  public displays: boolean = false;
  constructor(
    private provisionningService: ProvisionningService,
    private toastService: ToastrService,
    private toastrService: ToastrService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.isFilter();
    this.GetAllServices();
  }

  public close(): void {
    this.formsView.emit(false);
  }


  public GetAllServices() {
    this.provisionningService
      .GetAllServices({})
      .subscribe({
        next: (response) => {
          this.listProducts = response['data'];
        },
        error: (error) => {
          this.toastService.error(error.error.message);
        }
      })
  }

  public GetAllAchats() {
    this.provisionningService
      .GetAllAchats({}, 1)
      .subscribe({
        next: (response) => {
          this.listCommandes.emit(response['data']);
          this.close();
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
      this.currentItem = { ...item, quantite: 1 };
    } else {
      this.currentItem = item;
    }
  }
  hideModal() {
    this.modalService.dismissAll();
  }

  OnAddToPanier(data: any) {
    let findProduct = this.panierList.find((it) => it.id === data.id);
    if (findProduct === undefined) {
      this.panierList.push(data);
    } else {
      findProduct.quantite = this.currentItem?.quantite;
    }
    this.hideModal()
  }
  OnIncrementButton(data: any) {
    let findProduct = this.panierList.find((it) => it.id === data.id);
    if (findProduct === undefined) {
      this.panierList.push(data);
    } else {
      findProduct.quantite += 1;
    }
  }
  OnIecrementButton(data: any) {
    if (data.quantite <= 1) {
      return;
    } else {
      data.quantite -= 1;
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
      totale += item.quantite;
    });
    return totale;
  }

  totalPrice() {
    var total = 0;
    this.panierList.forEach((item: any) => {
      total += item.prix_unitaire * item.quantite;
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

  public OnSaveCommande(): void {
    this.provisionningService
      .OnSaveCommande({
        operation: OperationTransaction.ACHAT_SERVICE,
        detail_commande: this.panierList,
      }).subscribe({
        next: (response) => {          
          this.toastrService.success(response.message);
          this.GetAllAchats();
        },
        error: (error) => {          
          this.displays = false
          this.toastrService.error(error.error.message);
        }
      })
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

  public isFilter(): boolean {
    return (!this.selectedQtyBlanche && !this.selectedQtyMsimsdn && !this.selectedvp) ? true : false
  }
}
