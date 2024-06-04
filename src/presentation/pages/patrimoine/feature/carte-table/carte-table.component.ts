import { Component, Input } from "@angular/core";
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: 'app-carte-table',
    templateUrl: './carte-table.component.html'
})

export class CarteTableComponent {
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    @Input() listPatrimoines;
    public response: any = {};
    @Input() pargination;
    public itemCatreSim: {};

    constructor(public toastrService: ToastrService, private clipboardApi: ClipboardService) {}
    
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
}