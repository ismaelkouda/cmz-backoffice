import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import readXlsxFile from "read-excel-file";
import Swal from 'sweetalert2';

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

  arrayHeaderExcelFile: Array<any> = [];
  arrayContentExcelFile: Array<any> = [];
  formatData: any[] = [];
  statutCompare: boolean = false;
  fileName: string;

  constructor(
    private toastrService: ToastrService
    ) { }

  ngOnInit() { 

    console.log("currentArrayHeaders",this.currentArrayHeaders);

  }  

  closeModalAjoutInMass() { if(this.displayModalAjoutEnMasse) { this.resetFile() } }
  onExcelFileChange(event: FileList) {
    if(event.length != 0) {
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
  isArraySame(arr1: string[], arr2): boolean {
    if (arr1.length !== arr2.length) {
      this.toastrService.error('Nombre de colonne du fichier n\'est le bon');
      return false
    }else {    
      return true
    }
  }
  messageFileIsNotCorrect() {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false,
      });
      swalWithBootstrapButtons.fire({
        title: this.typeOuvrage,
        icon: 'error',
        text: `Structure du fichier incohérente`,
        confirmButtonColor: '#F07427',
        confirmButtonText: 'ok',
      });
  }
  formatDataToSend() {
    this.arrayContentExcelFile.map((item) => {
      this.formatData.push({...this.arrayHeaderExcelFile.reduce((ac, key, i) => ({ ...ac, [key.toLowerCase()]: item[i] }), {})})
    });
    this.currentArrayForm.emit(this.formatData);
  }
  checkFile() {
    const isFileCorrect = this.isArraySame(this.arrayHeaderExcelFile, this.currentArrayHeaders);    
    if (isFileCorrect === false) {
      this.messageFileIsNotCorrect()
    } else {
      this.statutCompare= true;
      this.toastrService.success('Structure cohérente');
      this.formatDataToSend();
    }
  }

  downloadModelXls() {
    window.open(this.fileModel, "_blank");
  }
}
