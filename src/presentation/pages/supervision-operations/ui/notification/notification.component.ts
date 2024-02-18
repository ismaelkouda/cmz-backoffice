import { Component, OnInit } from '@angular/core';
import { SupervisionOperationService } from '../../data-access/supervision-operation.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DemandeShowComponent } from '../../feature/demande-show/demande-show.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public initialView: boolean = true;
  public listNotifys: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public showView: boolean = false;
  public currentData: any;

  constructor(
    private supervisionOperationService: SupervisionOperationService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.GetAllNotifications()
  }

  public GetAllNotifications(): void {
    this.supervisionOperationService
      .GetAllNotifications({})
      .subscribe({
        next: (response) => {
          this.listNotifys = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  /*
  public onShowNotification(data): void {
    this.currentData = data;
    this.initialView = false;
    this.showView = true;
    this.currentData = data;
  }
  */
  public onShowNotification(data): void {
    if (data.type === 'transaction') {
       this.OnShowTraitement(data)
    }else{
      this.currentData = data;
      this.initialView = false;
      this.showView = true;
      this.currentData = data;
    }
  }
  OnShowTraitement(data: Object): void {
    const modalRef = this.modalService.open(DemandeShowComponent, {
      ariaLabelledBy: "modal-basic-title",
      backdrop: "static",
      keyboard: false,
      centered: true,
    });
    modalRef.componentInstance.transaction = data;
  }
  public pushStatutView(event: boolean): void {
    this.showView = event;
    this.initialView = !event;
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllNotifications()
  }
}
