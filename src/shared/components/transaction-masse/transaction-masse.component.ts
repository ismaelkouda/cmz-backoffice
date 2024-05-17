import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import readXlsxFile from "read-excel-file";

@Component({
  selector: 'app-transaction-masse',
  templateUrl: './transaction-masse.component.html',
  styleUrls: ['./transaction-masse.component.scss']
})
export class TransactionMasseComponent implements OnInit {

  @Output() currentArrayForm = new EventEmitter<any>();
  @Input() currentArrayHeaders;
  @Input() fileModel: any;
  @Input() typeOuvrage: any;
  @Input() displayModalAjoutEnMasse: boolean;
  currentFile: any;
  arrayHeaderExcelFile: Array<any> = [];
  arrayContentExcelFile: Array<any> = [];
  fileName: string;

  constructor(
    private toastrService: ToastrService
    ) { }

  ngOnInit() {}  

  onExcelFileChange(event: FileList) {
    if(event.length != 0) {
      this.currentFile = event.item(0);
      readXlsxFile(event[0]).then((rows) => {
        this.arrayHeaderExcelFile = rows[0];  
        this.arrayHeaderExcelFile.shift()
        this.arrayContentExcelFile = rows;        
        this.arrayContentExcelFile.shift();
        this.fileName = event[0]?.name;
      });
    } else {
      this.resetFile();
    }
  }
  resetFile() {
    this.arrayHeaderExcelFile = [];
    this.arrayContentExcelFile = [];
    this.fileName = '';
  }

  formatDataToSend() {
    this.currentArrayForm.emit(this.currentFile);
  }
  checkFile() {
    this.formatDataToSend();
    this.toastrService.success('Structure cohérente');
  }

  downloadModelXls() {
    window.open(this.fileModel, "_blank");
  }
}
