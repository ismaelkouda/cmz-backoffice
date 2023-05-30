import { InterconnexionService } from './../../data-access/interconnexion.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connexion-api',
  templateUrl: './connexion-api.component.html',
  styleUrls: ['./connexion-api.component.scss']
})
export class ConnexionApiComponent implements OnInit {


  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;

  constructor(
    private interconnexionService: InterconnexionService,
  ) { }

  ngOnInit() {
  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }

  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
}
