import { Component, Input } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { TableConfig, TableExportExcelFileService } from "../../../../../../../../shared/services/table-export-excel-file.service";
import { TABLE_WHITE_SIM_CARD_DETAILS, WhiteSimCard, WhiteSimCardDetails } from "../../data-access/white-sim-card-details/table-white-sim-card-details";
import { SharedDataService } from "../../../../../../../../shared/services/shared-data.service";

type TYPECOPY = "iccid" | "imsi";

@Component({
    selector: "app-table-white-sim-card-details",
    templateUrl: "./table-white-sim-card-details.component.html"
})

export class TableWhiteSimCardDetailsComponent {

    @Input() listWhiteSimCardDetails: WhiteSimCardDetails;
    @Input() spinner: boolean;
    public IsLoading: boolean;
    public selectedWhiteSimCardDetails: WhiteSimCard;
    public table: TableConfig = TABLE_WHITE_SIM_CARD_DETAILS;

    constructor(private toastService: ToastrService, private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService, private sharedDataService: SharedDataService,
    ) { }

    public getStatutBadge(statut: string): string {
        switch (statut) {
            case "disponible":
                return "badge-success";

            case "attribué":
                return "badge-warning";

            case "reservé":
                return "badge-secondary";
        }
        return "badge-dark";
    }

    public copyData(selectedDetailsWhiteSimCard: WhiteSimCardDetails, type: TYPECOPY): void {
        this.toastService.success("Copié dans le presse papier");
        this.clipboardService.copyFromContent(selectedDetailsWhiteSimCard[type]);
    }

    public pageCallback() {
        this.sharedDataService.sendPatrimoineDetailsWhiteSimCard();
    }

    public onExportExcel(): void {
        this.tableExportExcelFileService.exportAsExcelFile(this.listWhiteSimCardDetails.carte_sims, this.table, `liste_carte_sim_blanche_du_dossier_${this.listWhiteSimCardDetails.numero_demande}`);
    }
}