import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { Table } from 'primeng/table';

@Component({
    selector: `app-search-table`,
    standalone: true,
    imports: [TranslateModule, InputTextModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="p-input-icon-left">
            <input
                pInputText
                type="text"
                icon="pi pi-search"
                (input)="onSearch($event.target.value.trim())"
                placeholder="{{ 'COMMON.RESEARCH' | translate }}..."
                class="search-input"
                aria-label="Search"
            />
        </div>
    `,
})
export class SearchTableComponent {
    @Input() dt!: Table;
    @Output() searchEvent: EventEmitter<string> = new EventEmitter<string>();

    onSearch(value: string): void {
        console.log(value);
        this.searchEvent.emit(value);
        if (this.dt) {
            this.dt.filterGlobal(value, 'contains');
        }
    }
}
