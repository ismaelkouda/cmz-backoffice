import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { HistoryApiService } from "../../data-access/services/history-api.service";
import { Observable, Subject, map, takeUntil } from "rxjs";
import { DetailsHistoryData, DetailsHistoryDataChange } from "../../data-access/interfaces/details-historique.interface";

@Component({
    selector: "app-details-history",
    templateUrl: "./details-history.component.html"
})

export class DetailsHistoryComponent implements OnInit, OnDestroy {
    @Input() idModel: number;
    @Input() typeModel: string;
    @Input() historySelected: any;
    @Output() visibleDetailsHistory: EventEmitter<boolean> = new EventEmitter<boolean>();
    public detailsHistory$: Observable<DetailsHistoryData>;
    public transformedUpdateData$: Observable<DetailsHistoryDataChange[]>;
    private destroy$ = new Subject<void>();

    constructor(private historyApiService: HistoryApiService) { }

    ngOnInit(): void {
        this.detailsHistory$ = this.historyApiService.getDetailsHistory();
        this.historyApiService.getDetailsHistory().pipe(takeUntil(this.destroy$)).subscribe((history: DetailsHistoryData) => {
            if (history.typeAction === 'Mise à jour') {
                this.transformedUpdateData$ = this.detailsHistory$.pipe(
                    map((event: any) =>
                        event?.data.map((item) => ({
                            key: item.key,
                            previousValue: item.previousValue ?? '',
                            currentValue: item.currentValue ?? ''
                        })) || []
                    )
                );
            } else {
                this.transformedUpdateData$ = this.detailsHistory$.pipe(
                    map((event: any) =>
                        event?.data.map((item) => ({
                            key: item.key,
                            value: item.value ?? '',
                        })) || []
                    )
                );
            }
        })
        const dataToSend = [{ typeModel: this.typeModel }];
        this.historyApiService.fetchDetailsHistory(this.historySelected?.id, dataToSend);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}