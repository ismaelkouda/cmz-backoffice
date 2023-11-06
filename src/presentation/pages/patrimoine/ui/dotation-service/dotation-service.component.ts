import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { ActivatedRoute } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { ProvisionningService } from 'src/presentation/pages/provisionning/data-access/provisionning.service';
const Swal = require('sweetalert2');

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
  public listThirdLevel: Array<any> = [];
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentSolde: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public currentObject: any;
  public selectedNumero: string;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedEmplacement: string;
  public selectedGroupe: string;
  public selectedThirdLevel: any;
  public display: boolean = false;
  public isMaximized: boolean = false;
  public soldeGlobal: string  ;

  constructor(
    public settingService: SettingService,
    public patrimoineService: PatrimoineService,
    public provisionningService: ProvisionningService,
    private mappingService: MappingService,
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
    this.mappingService.GetAllPortefeuille()
    this.OnRefreshValues()
  }

  public GetAllDotations() {
    this.patrimoineService
      .GetAllDotations({},this.p)
      .subscribe({
        next: (response) => {
          this.listDotations = response['data']['data'];
          this.totalPage = response['data'].last_page;
          this.totalRecords = response['data'].total;
          this.recordsPerPage = response['data'].per_page;
          this.offset = (response['data'].current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onFilter() {
    this.patrimoineService
      .GetAllDotations({
        numero_dotation: this.selectedNumero,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        emplacement: this.selectedEmplacement,
      },this.p)
      .subscribe({
        next: (response) => {
          this.listDotations = response['data']['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  OnRefresh() {
    this.GetAllDotations();
    this.selectedSim = null;
    this.selectedimsi = null;
  }
  OnRefreshValues(){        
    this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
      this.soldeGlobal = res
    });
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllDotations()
    } else {
      this.onFilter()
    }
  }
  public showDialog(data: any): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons.fire({
      icon: "info",
      html: `<strong>Message</strong> : ${data["description"]} <br>`,
      confirmButtonColor: "#F07427",
      confirmButtonText: "ok",
    });
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
    return (!this.selectedNumero && !this.selectedSim && !this.selectedimsi && !this.selectedEmplacement) ? true : false
  }
  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }
}
