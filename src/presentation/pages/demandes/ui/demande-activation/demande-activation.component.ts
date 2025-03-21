import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'app-demande-activation',
  templateUrl: './demande-activation.component.html',
  styleUrls: ['./demande-activation.component.scss']
})
export class DemandeActivationComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listStatuts: Array<any> = [];
  public listTransactions: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public transactionId: string;
  public showView: boolean = false;
  public typeDemande: string;
  public currentOperation: string = OperationTransaction.ACTIVATION;
  public title = 'Demande abonnement - Système de Gestion de Collecte Centralisée';

  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public toastrService: ToastrService,
    private titleService: Title,
    private activatedRoute: ActivatedRoute
  ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
    if (history.state.patrimoine) {
    }
  }

  public pushStatutView(event: boolean): void {    
    this.formsView = event;
    this.initialView = !event;
  }
  public pushCurrentObject(event: any): void {    
    this.formsView = event;
    this.initialView = !event;
    this.currentObject = event; 
  }
  public pushStatutShowView(event: boolean): void {    
    this.showView = event;
    this.initialView = !event;
    this.formsView = event; 
  }
  public pushTypeDemande(event: string): void {    
    this.typeDemande = event;
  }
  public pushTransactionId(event: string): void { 
    if (event) {
      this.transactionId = event;
      this.showView = true;
      this.initialView = false;
      this.formsView = false;
    }
  }
  public pushListTransactions(event: any): void {    
    this.listTransactions = event;
  }
}
