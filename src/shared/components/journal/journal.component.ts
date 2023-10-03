import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { SettingService } from "src/shared/services/setting.service";

@Component({
  selector: "app-journal",
  templateUrl: "./journal.component.html",
  styleUrls: ["./journal.component.scss"],
})
export class JournalComponent implements OnInit {

  @Input() transaction;
  @Input() type;
  response: any;
  commentaire: any;
  listJournal: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;


  public p: number = 1;

  constructor(
    private activeModal: NgbActiveModal,
    private settingsService: SettingService,
    private toastrService: ToastrService
  ) { }

  /**
   * @author André ATCHORI
   */

  ngOnInit() {
    this.getAllJournal();
  }

  closeModal() {
    this.activeModal.close();
  }

  getAllJournal() {
    this.settingsService
      .getAllJournal({
        transaction: this.transaction.transaction,
      }).subscribe({
        next: (response) => {
          this.listJournal = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

}
