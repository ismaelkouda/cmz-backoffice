import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Folder } from '../../../../interfaces/folder';
import {
    OperationTransaction,
    TitleOperation,
} from '../../../../enum/OperationTransaction.enum';
import { SharedService } from '../../../../services/shared.service';
import { OnInit } from '@angular/core';
import { SimDemand } from '../../../../interfaces/details-mobile-subscriptions.interface';

@Component({
    selector: `app-form-sim-demand`,
    templateUrl: `./form-sim-demand.component.html`,
    styleUrls: [`./form-sim-demand.component.scss`],
})
export class FormSimDemandComponent implements OnInit {
    @Input() demandSelected: SimDemand;
    public detailsLine$: Observable<Object>;
    public typeOperation = OperationTransaction;
    private destroy$ = new Subject<void>();
    public spinner: boolean = true;
    @Output() visibleFormLine: EventEmitter<boolean> =
        new EventEmitter<boolean>();

    constructor(private sharedService: SharedService) {}

    ngOnInit() {
        this.sharedService.fetchDetailsLine({
            transaction: this.demandSelected?.transaction,
            operation: this.demandSelected?.operation,
        });
        this.detailsLine$ = this.sharedService.getDetailsLine();
        this.sharedService
            .isLoadingDetailsLine()
            .pipe(takeUntil(this.destroy$))
            .subscribe((spinner: boolean) => {
                this.spinner = spinner;
            });
    }

    // public mappingNotation(notation: "mécontent" | "neutre" | "content"): string {
    //   switch (notation) {
    //     case "mécontent": {
    //       return "assets/images/icones/sad.png";
    //     }
    //     case "neutre": {
    //       return "assets/images/icones/confused.png";
    //     }
    //     case "content": {
    //       return "assets/images/icones/smile.png";
    //     }
    //   }
    // }
    public OnGetRapportCodeStyle(code: any): string {
        if (code.includes('102') || code.includes('200')) {
            return 'style200';
        } else if (code.includes('100')) {
            return 'style100';
        } else {
            return 'styledefault';
        }
    }

    public pipeValue(number: any) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }

    public handleCloseModal(): void {
        this.visibleFormLine.emit(false);
    }
}
