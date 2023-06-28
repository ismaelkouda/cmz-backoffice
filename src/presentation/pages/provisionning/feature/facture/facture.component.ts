import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  @Input() currentObjectTwo;
  @Input() currentId;
  @Output() factureView = new EventEmitter();

  constructor(
    private router: Router,
    private ProvisionningService: ProvisionningService,
    private toastrService: ToastrService,
    private storage: EncodingDataService
  ) { }

  ngOnInit() { }
  public onToBack(): void {
    this.factureView.emit(false);
  }

  public OnValidate() {
    console.log("this.currentIdthis.currentId", this.currentId);

    this.ProvisionningService
      .OnValidate(this.currentId)
      .subscribe({
        next: (response) => {
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public close(): void {
    this.factureView.emit({ statut: false, type: 'fermer' });
  }
  public onValidate() {

  }
}
