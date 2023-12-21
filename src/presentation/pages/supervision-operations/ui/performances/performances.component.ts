import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-performances',
  templateUrl: './performances.component.html',
  styleUrls: ['./performances.component.scss']
})
export class PerformancesComponent implements OnInit {

  public listOperations: Array<any> = [];
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public listFirstLevel: Array<any> = [];
  public listSecondLevel: Array<any> = [];
  public selectedTypeOperation: string;
  public selectedTransaction: string;
  public selectedFirstLevel: any;
  public selectedSecondLevel: any;

  constructor(
    private settingService: SettingService,
    private mappingService: MappingService,
    private toastrService: ToastrService,


  ) {
    Object.values(OperationTransaction).forEach(item => {
      this.listOperations.push(item);
    });
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.GetFirstLevel()
    this.isFilter()
    //localStorage.setItem('layout', 'Barcelona');
  }


  public onFilter() {

  }
  public GetFirstLevel() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listFirstLevel = response['data'].map(element => {
            return { ...element, fullName: `${element.nom} [${element.code}]` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onChangeItem(event: any) {
    this.selectedFirstLevel = event.value;
    this.listSecondLevel = this.selectedFirstLevel?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }

  showInfos(data) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false,
    })
    if (data === 'dmt') {
      swalWithBootstrapButtons.fire({
        icon: 'info',
        html: '<b style="font-size:30px;">Délai Moyen de Traitement</b><br><p style="font-size:19px;">Le Délai Moyen de traitement (DMT) est un indicateur clé pour mesurer la performance des équipes de traitements. Il représente la durée moyenne d\'une demande entre sa création et sa clôture.</p>',
        confirmButtonColor: '#F07427',
        confirmButtonText: 'ok',
      });
    } else {
      swalWithBootstrapButtons.fire({
        icon: 'info',
        html: '<b style="font-size:30px;">Service-Level Agreement </b><br><p style="font-size:19px;">Un accord de niveau de service, ou SLA (Service-Level Agreement), est un engagement de niveau de services sur la durée maximale de traitement des demandes emises. Cet engagement relate les services que le fournisseur met à disposition et des paramètres comme leurs disponibilités ou les temps de réponse.</p>',
        confirmButtonColor: '#F07427',
        confirmButtonText: 'ok',
      });
    }
  }
  public isFilter(): boolean {
    return (!this.selectedTypeOperation &&
      !this.selectedFirstLevel &&
      !this.selectedSecondLevel &&
      !this.selectedTransaction
    ) ? true : false
  }
}
