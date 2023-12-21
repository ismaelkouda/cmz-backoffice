import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { formDataBuilder } from 'src/shared/constants/formDataBuilder.constant';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { PATRIMOINE } from 'src/shared/routes/routes';
import { MappingService } from 'src/shared/services/mapping.service';
import { TRANSACTION_SIM } from '../../patrimoine-routing.module';
import { EndPointUrl } from '../../data-access/api.enum';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Component({
  selector: 'app-reactivation-form',
  templateUrl: './reactivation-form.component.html',
  styleUrls: ['./reactivation-form.component.scss']
})
export class ReactivationFormComponent implements OnInit {

  @Input() patrimoine;
  public selectedPiece: any;
  public selectedDescription: string
  public baseUrl: string;

  constructor(
    private toastrService: ToastrService,
    private mappingService: MappingService,
    private activeModal: NgbActiveModal,
    private router: Router,
    private httpClient: HttpClient,
    private storage: EncodingDataService
  ) {
    const data = JSON.parse(this.storage.getData('user'))
    this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`
  }

  ngOnInit() {
  }

  public onChangeFile(file: FileList) {
    this.selectedPiece = file.item(0);
  }
  public handleCloseModal(): void {
    this.activeModal.close();
  }
  public handleReactivation() {
    let baseUrl;
    baseUrl = `${this.baseUrl}${EndPointUrl.CHANGE_STATUT}`
    this.httpClient.post(`${baseUrl}`, formDataBuilder({
      ...this.patrimoine,
      operation: OperationTransaction.RE_ACTIVATION,
      description: this.selectedDescription,
      justificatif: this.selectedPiece,
    })).subscribe({
        next: (response: any) => {
          this.handleCloseModal();
          this.router.navigateByUrl(`${PATRIMOINE}/${TRANSACTION_SIM}` );
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
}


























