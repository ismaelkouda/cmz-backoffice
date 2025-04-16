import { TABLE_DATA_BALANCE } from './../../../../data-access/profiles-supervision/data-balance/table-data-balance';
import { DataBalance, TABLE_SMS_BALANCE } from './../../../data-access/data-balance/table-data-balance';
import { EventEmitter, Input, Output } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { SharedDataService } from '../../../../../../../shared/services/shared-data.service';
import { JournalComponent } from '../../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../../shared/constants/modalParams.contant';
import { TableConfig, TableExportExcelFileService } from '../../../../../../../shared/services/table-export-excel-file.service';

type TYPECOPY = "numero_demande";
type Action = PageAction | ModalAction;
type PageAction = { data: DataBalance, action: 'détails', view: 'page' } |
                  { data: DataBalance, action: 'visualiser', view: 'page' };
type ModalAction = { data: DataBalance, action: 'journal', view: 'modal' };

@Component({
  selector: `app-table-data-balance`,
  templateUrl: `./table-data-balance.component.html`
})

export class TableDataBalanceComponent {

  @Output() interfaceUser = new EventEmitter<PageAction>();
  @Input() listDataBalance: Array<DataBalance>;
  @Input() pagination: any;
  @Input() spinner: boolean;
  @Input() selectedDataBalance: DataBalance;
  public table: TableConfig = TABLE_DATA_BALANCE;

  constructor(public toastService: ToastrService, private sharedDataService: SharedDataService,
    private tableExportExcelFileService: TableExportExcelFileService, private ngbModal: NgbModal,
    private clipboardService: ClipboardService,) { }


    public copyData(selectedDetailsDataBalance: DataBalance, type: TYPECOPY): void {
        this.toastService.success("Copié dans le presse papier");
        this.clipboardService.copyFromContent(selectedDetailsDataBalance[type]);
    }

  public pageCallback() {
    this.sharedDataService.sendPatrimoineDataBalance();
  }

  public viewDataBalanceDetails(params: { data: DataBalance, action: 'visualiser', view: 'page' }): void {
    if(params) this.interfaceUser.emit(params);
  }

  public onExportExcel(): void {
    this.tableExportExcelFileService.exportAsExcelFile(this.listDataBalance, this.table, "liste_solde_data");
  }

  public getStatutBadge(statut: string): string {
      switch (statut) {
          case "disponible":
              return "badge-success";

          case "epuisé":
              return "badge-danger";

      }
      return "badge-dark";
  }

  public onAction(params: Action): void {
      this.selectDataBalance(params.data);
      switch (params.view) {
          case "page":
              this.interfaceUser.emit(params);
              break;

          case "modal":
              this.onOpenModal(params);
              break;
      }
  }

  

  getTreatmentButtonStyle(selectedDetailsDataBalance: DataBalance): any {
    if (!selectedDetailsDataBalance) return null;

    const treatmentStyles = {
        ["actif"]: {
          class: 'p-button-warning',
          icon: 'pi pi-times-circle',
          tooltip: 'Désactiver',
        },
        ["inactif"]: {
          class: 'p-button-success',
          icon: 'pi pi-check-circle',
          tooltip: 'Activer',
        }
    };

    return treatmentStyles[selectedDetailsDataBalance.statut] || null;
  }

  private onOpenModal(params: ModalAction): void {
      if (params.action === "journal") this.showJournal(params.data)
  }

  public showJournal(selectedDataBalance: Object): void {
      const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
      modalRef.componentInstance.typeJournal = "dataBalance";
      modalRef.componentInstance.numero_demande = selectedDataBalance['reference'];
  }

  private selectDataBalance(selectedDataBalance: DataBalance): void {
      this.selectedDataBalance = selectedDataBalance;
  }

}