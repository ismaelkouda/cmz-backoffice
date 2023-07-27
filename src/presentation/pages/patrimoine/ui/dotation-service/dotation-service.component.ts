import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dotation-service',
  templateUrl: './dotation-service.component.html',
  styleUrls: ['./dotation-service.component.scss']
})
export class DotationServiceComponent implements OnInit {

  public module: string;
  public subModule: string;
  public listDotations: Array<any> = [];
  public listGroupes: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedGroupe: string;
  public selectedStatut: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public display: boolean = false;
  public isMaximized: boolean = false;

  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.isFilter();
    this.GetAllDotations();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[2];
    });
  }

  public GetAllDotations() {
    this.patrimoineService
      .GetAllTransactions({}, this.p)
      .subscribe({
        next: (response) => {
          this.listDotations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public onPageChange(event) {
    this.p = event;
    this.GetAllDotations()
  }

  public onFilter() {
    this.patrimoineService
      .GetAllTransactions({
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        statut: this.selectedStatut,
        operation: this.selectedGroupe
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listDotations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  showJournal(content, data: any) {
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public hideDialog(data) {
    this.display = false;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public pushlistDotations(event: any): void {
    this.listDotations = event;
  }

  disableAction(): boolean {
    return null;
  }
  public isFilter(): boolean {
    return (!this.selectedSim && !this.selectedimsi && !this.selectedGroupe && !this.selectedStatut) ? true : false
  }

}
