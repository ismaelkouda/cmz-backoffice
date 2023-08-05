import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ServiceEnum } from 'src/shared/enum/Service.enum';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vente-form',
  templateUrl: './vente-form.component.html',
  styleUrls: ['./vente-form.component.scss']
})
export class VenteFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listPatrimoines = new EventEmitter();
  @Output() formsView = new EventEmitter();
  public listGroupes: Array<any> = []
  public selectedValue: any;
  public currentPatrimoine: any = {};
  public selectedService: string = ServiceEnum.AIRTIME;
  public airtimeService: string = ServiceEnum.AIRTIME;
  public dataService: string = ServiceEnum.DATA;
  public selectedDescription: string;
  public siteKey: string;
  public currentRecaptcha: string;

  public selectedBcy: string = TypeBeneficiare.BENEFICIAIRE;
  public beneficiaryBcy: string = TypeBeneficiare.BENEFICIAIRE;
  public msisdnBcy: string = TypeBeneficiare.MSISDN;
  public userBcy: string = TypeBeneficiare.USER;
  public groupeBcy: string = TypeBeneficiare.GROUPE;

  constructor(
    private toastrService: ToastrService

  ) { }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public changeItem(event: any) {
    this.selectedValue = null
  }

  public onVerify() {

  }

  HandleSaveVente() {

  }

  public isFilter() {

  }
}

export enum TypeBeneficiare {
  BENEFICIAIRE = 'BENEFICIAIRE',
  MSISDN = 'MSISDN',
  USER = 'USER',
  GROUPE = 'GROUPE',
}