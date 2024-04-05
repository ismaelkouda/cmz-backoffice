import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ServiceEnum } from 'src/shared/enum/Service.enum';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-dotation-form',
  templateUrl: './dotation-form.component.html',
  styleUrls: ['./dotation-form.component.scss']
})
export class DotationFormComponent implements OnInit, OnDestroy {

  @Input() currentObject;
  @Output() listDotations = new EventEmitter();
  @Output() formsView = new EventEmitter();

  public listGroupes:  Array<any> = []
  public soldeGlobal: string;
  public radioValue: string = 'MSISDN';
  public selectedValue: any;
  public currentPatrimoine: any = {};
  public selectedService: string = ServiceEnum.DATA;
  public airtimeService: string = ServiceEnum.AIRTIME;
  public dataService: string = ServiceEnum.DATA;
  public selectedDescription: string;
  public selectedVolume: number
  public currentGroupe: any = {};
  public simArray: Array<any> = []
  public selectedGroupe: any;
  public siteKey: string;
  public historie: any;

  constructor(
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService,
    private mappingService: MappingService,
  ) {
   }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.GetAllGroupes()
    this.isFilter()    
    this.IsValidate()
    this.OnRefreshValues();
    this.historie = history.state.patrimoine
    if (this.historie) {
      this.currentPatrimoine = history.state.patrimoine      
    }    
  }
  public GetAllGroupes(): void {
    this.patrimoineService
      .GetAllGroupes({})
      .subscribe({
        next: (response) => {
          this.listGroupes = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public close(): void {
    this.formsView.emit(false);
  }
  public GetAllDotations() {
    this.patrimoineService
      .GetAllDotations({},1)
      .subscribe({
        next: (response) => {
          this.listDotations.emit(response['data']['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  OnRefreshValues(){
    this.mappingService.volumeDataGlobal$.subscribe((res: any) => {
      this.soldeGlobal = res
    });
  }

  public onVerifyImsi() {
    this.patrimoineService
      .OnVerify({
        msisdn: this.selectedValue
      }).subscribe({
        next: (response: any) => {
         this.currentPatrimoine = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
          //this.currentPatrimoine = {}
        }
      })
  }
  public onVerifyGroupe() {
    this.patrimoineService
      .OnVerifyGroupe({
        groupe_id: this.selectedGroupe?.id
       }).subscribe({
        next: (response: any) => {
          this.currentGroupe = response['data'];
          if (this.currentGroupe?.sims.length > 0) {
            this.currentGroupe?.sims.map(item => {
              this.simArray.push(item.imsi)
            });
          }
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnVerify(){
    if (this.radioValue === 'MSISDN') {      
      this.onVerifyImsi()
    }else{
      this.onVerifyGroupe()
    }
  }

  public changeItem(event: any) {
    this.currentPatrimoine = {}
    this.currentGroupe = {}
    this.selectedValue = null
    this.selectedGroupe = null
    this.selectedVolume = null
    this.selectedDescription = null

  }

  handleSaveDotation() {
    this.patrimoineService
      .handleSaveDotation({
        service: this.selectedService,
        description: this.selectedDescription,
        ...(this.radioValue === 'MSISDN' ? { sims: [this.currentPatrimoine.msisdn] } : { sims: this.simArray }),
        valeur: this.selectedVolume
       }).subscribe({
        next: (response: any) => {
          this.GetAllDotations()
          this.mappingService.GetAllPortefeuille()
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public isFilter(): boolean {
    return (!this.selectedValue && !this.selectedGroupe) ? true : false
  }
  public IsValidate(): boolean {
    return (
      !this.currentPatrimoine ||
      !this.currentGroupe ||
      !this.selectedVolume ||
      !this.selectedDescription
      ) ? true : false
  }

  ngOnDestroy(): void {
     history.state.patrimoine = null
  }
}
