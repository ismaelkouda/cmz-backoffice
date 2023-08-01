import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { ServiceEnum } from 'src/shared/enum/Service.enum';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dotation-form',
  templateUrl: './dotation-form.component.html',
  styleUrls: ['./dotation-form.component.scss']
})
export class DotationFormComponent implements OnInit {

  @Input() currentObject;
  @Output() listPatrimoines = new EventEmitter();
  @Output() formsView = new EventEmitter();
  public listGroupes: Array<any> = []
  public radioValue: string = 'IMSI';
  public selectedValue: any;
  public currentPatrimoine: any = {};
  public selectedService: string = ServiceEnum.AIRTIME;
  public airtimeService: string = ServiceEnum.AIRTIME;
  public dataService: string = ServiceEnum.DATA;
  public selectedDescription: string;
  public siteKey: string;
  public currentRecaptcha: string;


  constructor(
    private patrimoineService: PatrimoineService,
    private toastrService: ToastrService

  ) { }

  ngOnInit() {
    this.siteKey = environment.recaptcha.siteKey;
    this.GetAllGroupes()

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

  public changeItem(event: any) {
    this.selectedValue = null
  }

  public onVerify() {

  }

  HandleSaveDotation() {

  }

  public isFilter() {

  }
}
