import { ToastrService } from 'ngx-toastr';
import { SupervisionOperationService } from './../../data-access/supervision-operation.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeShowComponent } from '../../feature/demande-show/demande-show.component';


@Component({
  selector: 'app-alarmes',
  templateUrl: './alarmes.component.html',
  styleUrls: ['./alarmes.component.scss']
})
export class AlarmesComponent implements OnInit {

  public listDemandes: Array<any> = [];
  public listOperations: Array<any> = [];
  public filterStatus: string;
  public filtreSelected: string;
  public typeAchat: string = 'commande_produit';
  public typeActivation: string = 'demande_activation';
  public typeChangement: string = 'swap';
  public typeSuspension: string = 'suspension';
  public typeResiliation: string = 'resiliation';
  public typeProvisionning: string = 'provisionning';
  public typeVolume: string = 'volume_data';
  public currentKey: string;


  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,

  ) {
    this.filterStatus = this.typeAchat;

    console.log("filter", this.filterStatus);

  }

  ngOnInit() {
    this.GetAllDemandes();
    localStorage.setItem('layout', 'Barcelona');

  }

  public GetAllDemandes() {
    this.supervisionOperationService
      .GetAllDemandes({})
      .subscribe({
        next: (res) => {
          this.listDemandes = res['data'];
        }, error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public mappingResponse(key: string): any[] {
    return this.listDemandes[key];
  }

  public filterService(status) {
    this.filterStatus = status;
  }
  public HandleFormatTitle(title): string {
    return this.supervisionOperationService.HandleFormatTitle(title);
  }
  HandleFormatSecondTitle(title: string) {
    switch (title) {
      case this.typeAchat: {
        return "Achat de Services";
      }
      case this.typeActivation: {
        return "Activation de SIM";
      }
      case this.typeChangement: {
        return "Changement de SIM";
      }
      case this.typeSuspension: {
        return "Suspension de SIM";
      }
      case this.typeResiliation: {
        return "Résiliation de SIM";
      }
      case this.typeVolume: {
        return "Depot de volume	";
      }
      case this.typeProvisionning: {
        return 'Ligne de Credit';
      }
      default:
        return 'N/A'
    }
  }
  OnShowDemande(data: Object): void {
    const modalRef = this.modalService.open(DemandeShowComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });    
    modalRef.componentInstance.transaction = data;
    // modalRef.componentInstance.resultTraitement.subscribe((res) => {
    //   this.listDemandes = res['data']
    // })
  }
}

