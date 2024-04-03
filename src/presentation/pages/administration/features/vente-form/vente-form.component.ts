import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ServiceEnum } from 'src/shared/enum/Service.enum';

@Component({
  selector: 'app-vente-form',
  templateUrl: './vente-form.component.html',
  styleUrls: ['./vente-form.component.scss']
})
export class VenteFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listPatrimoines = new EventEmitter();
  @Output() formsView = new EventEmitter();
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

  constructor() { }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
  }

  public close(): void {
    this.formsView.emit(false);
  }
}

export enum TypeBeneficiare {
  BENEFICIAIRE = 'BENEFICIAIRE',
  MSISDN = 'MSISDN',
  USER = 'USER',
  GROUPE = 'GROUPE',
}
