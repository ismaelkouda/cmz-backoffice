import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
    selector: `app-search-table`,
    template: `
        <div class="p-input-icon-left">
            <i class="pi pi-search"></i>
            <input
                pInputText
                type="text"
                (input)="onSearch($event.target.value.trim())"
                placeholder="{{ 'RESEARCH' | translate }}..."
                class="search-input"
            />
        </div>
    `,
})
export class SearchTableComponent {
    @Input() dt!: Table;
    @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

    onSearch(value: string): void {
        this.searchEvent.emit(value);
        if (this.dt) {
            this.dt.filterGlobal(value, 'contains');
        }
    }
}
