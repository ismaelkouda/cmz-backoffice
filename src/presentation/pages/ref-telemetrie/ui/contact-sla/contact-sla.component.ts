import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';
import { ClipboardService } from 'ngx-clipboard';
import { ExcelService } from 'src/shared/services/excel.service';
import { TelemetrieService } from '../../data-access/telemetrie.service';
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


  constructor(
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    public mappingService: MappingService
   ) {}

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
