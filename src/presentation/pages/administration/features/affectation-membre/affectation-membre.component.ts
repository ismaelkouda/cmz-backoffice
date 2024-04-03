import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import readXlsxFile from 'read-excel-file';

@Component({
  selector: 'app-affectation-membre',
  templateUrl: './affectation-membre.component.html',
  styleUrls: ['./affectation-membre.component.scss']
})
export class AffectationMembreComponent implements OnInit {


  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  public fileName: string
  public currentFile: any;

  constructor() { }

  ngOnInit() {
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public onExcelFileChange(event: any): void {
    this.fileName = event.path[0].files[0].name;
    readXlsxFile(event.target.files[0]).then((rows) => {
    });
  }
  public downloadModelXls() {

  }

  public checkFile() {

  }

}
