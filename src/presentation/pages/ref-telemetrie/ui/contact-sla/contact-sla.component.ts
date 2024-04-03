import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { Title } from '@angular/platform-browser';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-contact-sla',
  templateUrl: './contact-sla.component.html',
  styleUrls: ['./contact-sla.component.scss']
})
export class ContactSlaComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public currentObject: any;
  public currentContact: any;
  public currentTabsIndex: number = 0;
  public title = 'Contact SLA - Système de Gestion de Collecte Centralisée';

  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    public mappingService: MappingService,
    private titleService: Title
   ) {
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GellAllContact();
  }
  public GellAllContact() {
    this.telemetrieService
    .GetContactSla()
    .subscribe({
      next: (response) => {
        this.currentContact = response['data']
      },
      error: (error) => {
        this.toastrService.error(error.error.message);
      }
    })
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'edit' };
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, type: 'show' };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListProfils(event: any): void {
    this.currentContact = event;
  }
  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }
}
