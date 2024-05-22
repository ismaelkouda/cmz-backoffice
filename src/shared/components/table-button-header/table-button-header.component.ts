import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-table-button-header',
    templateUrl: './table-button-header.component.html',
    styles: [
        `
        .margin-right-5 {
            margin-right: 5px;
        }
        `
    ]
})

export class TablebuttonHeaderComponent {
    @Output() refresh = new EventEmitter<void>();
    @Output() export = new EventEmitter<void>();
    @Output() other = new EventEmitter<void>();
    @Input() hiddenButtonRefresh: boolean;
    @Input() hiddenButtonExport: boolean;
    @Input() hiddenButtonOther: boolean;
    @Input() labelOther: string;
    @Input() iconOther: string;

    onRefresh() {
        this.refresh.emit();
    }

    onExport() {
        this.export.emit();
    }
}