import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import * as moment from 'moment';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  @Output() factureView = new EventEmitter();
  @Input() currentObjectTwo;
  @Output() listAchats = new EventEmitter();

  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public montantHt: number = 0;
  public montantTva: number = 0;
  public montantTtc: number = 0;
  public tenant: any;
  public currentDate: any;
  public delayDate: any;

  constructor(
    private provisionningService: ProvisionningService,
    private toastrService: ToastrService,
    private mappingService: MappingService
  ) {
    this.tenant = mappingService.tenant;
    //const today = moment().endOf('day')
    this.currentDate = moment().format('DD/MM/YYYY');
    this.delayDate = moment().add(6, 'days').format('DD/MM/YYYY');


  }

  ngOnInit() {
    this.montantHt = this.currentObjectTwo.map(item => {
      return item.prix_unitaire * item.qte
    }).reduce((totalPrice, singleItemPrice) => totalPrice + singleItemPrice, 0);

    this.montantTva = (this.montantHt * 18) / 100;
    this.montantTtc = this.montantHt - this.montantTva;

  }

  public GetAllAchats() {
    this.provisionningService
      .GetAllAchats({}, 1)
      .subscribe({
        next: (response) => {
          this.listAchats = response.data;
          this.totalPage = response.last_page;
          this.totalRecords = response.total;
          this.recordsPerPage = response.per_page;
          this.offset = (response.current_page - 1) * this.recordsPerPage + 1;
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onToBack(): void {
    this.factureView.emit(false);
  }

  public OnValidate() {
    this.provisionningService
      .OnValidate({
        operation: "commande-produits",
        achats: this.currentObjectTwo
      })
      .subscribe({
        next: (response) => {
          this.close();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public close(): void {
    this.factureView.emit({ statut: false, type: 'fermer' });
  }
  public onValidate() {

  }
  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
}
