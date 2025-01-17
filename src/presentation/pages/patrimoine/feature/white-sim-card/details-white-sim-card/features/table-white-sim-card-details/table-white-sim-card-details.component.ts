import { Component, Input } from "@angular/core";
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { TableConfig } from "../../../../../../../../shared/services/table-export-excel-file.service";
import { TABLE_WHITE_SIM_CARD_DETAILS, WhiteSimCardDetails } from "../../data-access/white-sim-card-details/table-white-sim-card-details";

type TYPECOPY = "iccid" | "imsi";

@Component({
    selector: "app-table-white-sim-card-details",
    templateUrl: "./table-white-sim-card-details.component.html"
})

export class TableWhiteSimCardDetailsComponent {

    @Input() listWhiteSimCardDetails: Array<WhiteSimCardDetails>;
    @Input() spinner: boolean;
    public IsLoading: boolean;
    public selectedWhiteSimCardDetails: WhiteSimCardDetails;
    public table: TableConfig = TABLE_WHITE_SIM_CARD_DETAILS;

    constructor(private toastrService: ToastrService, private clipboardService: ClipboardService,) { }

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
        this.toastrService.success("Copié dans le presse papier");
        this.clipboardService.copyFromContent(selectedDetailsWhiteSimCard[type]);
    }
}