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

  @Output() currentArrayForm = new EventEmitter<string>();
  @Input() currentArrayHeaders: ['NOM', 'PRENOMS', 'ADRESSE', 'CONTACTS', 'EMAIL', 'PROFIL'] | ['MARQUE', 'MODELE', 'NUMERO_SERIE', 'IMEI1', 'IMEI2', 'SIM1', 'SIM2'];
  @Input() fileModel: any;
  @Input() typeOuvrage: any;
  @Input() vue: 'enquetes-terrains' | 'operations-identification';
  @Input() displayModalAjoutEnMasse: boolean;

  arrayHeaderExcelFile: Array<any> = [];
  arrayContentExcelFile: Array<any> = [];
  formatData: any[] = [];
  statutCompare: boolean = false;
  fileName: string;
  commentaire: string;

  constructor( private toastrService: ToastrService ) { }

  ngOnInit() { }

   closeModalAjoutInMass() { if(this.displayModalAjoutEnMasse) { this.resetFile() } }

  // Debut: ajout du fichier excel au formulaire
  onExcelFileChange(event: FileList) {
    if(event.length != 0) {
      readXlsxFile(event[0]).then((rows) => {
        // debut: recuperer l'entete du fichier excel upload
        this.arrayHeaderExcelFile = rows[0];
        // fin: recuperer l'entete du fichier excel upload
  
        // debut: recuperer tout le contenu (le corps du fichier) du fichier excel upload
        this.arrayContentExcelFile = rows;
        // fin: recuperer tout le contenu (le corps du fichier) du fichier excel upload

        this.arrayContentExcelFile.shift(); // suuprime le premier objet qui est l'entete du tableau
  
        this.fileName = event[0]?.name;
      });
    } else {
      this.resetFile();
    }
  }
  // Fin: ajout du fichier excel au formulaire

  resetFile() {
    this.arrayHeaderExcelFile = [];
    this.arrayContentExcelFile = [];
    this.fileName = '';
  }

  // Debut: Verifier le fichier excel ajouté au formulaire est conforme au fichier qu'on attends
  /**
   * verifie d'abord si le nombre d'entete est exacte et si noms des entetes sont conformes
   * @param arr1 l'entete du fichier excel upload
   * @param arr2 le modele d'entete a respecter, il a été initialisé dans le constructor() du parent
   * @returns un message toastr ou un boolean(true) lorsqu'il y a une erreur; oubien un boolean(false) lorsqu'il n'y a pas d'erreur
   */
  isArraySame(arr1: string[], arr2) {
    if (arr1.length !== arr2.length) {
      this.toastrService.error('Nombre de colonne du fichier n\'est le bon');
      return false
    }else {
      return arr1.every((value, index) => { value === arr2[index] })
    }
  }
  // Fin: Verifier le fichier excel ajouté au formulaire est conforme au fichier qu'on attends

  // Debut: Message sweetAlert a afficher quand le fichier excel upload est incorrecte
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
  // Debut: Message sweetAlert a afficher quand le fichier excel upload est incorrecte

  // Debut: construction de l'object a envoyer au backend
  formatDataToSend() {
    this.arrayContentExcelFile.map((item) => {
      this.formatData.push({...this.arrayHeaderExcelFile.reduce((ac, key, i) => ({ ...ac, [key.toLowerCase()]: item[i] }), {})})
    });
  }
  // Fin: construction de l'object a envoyer au backend

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

  addMasseOperationIdentification(): void {
    this.currentArrayForm.emit(JSON.stringify({file: this.currentArrayForm, commentaire: this.commentaire}))
  }

  addMasseEnquetesTerrains(): void {
    this.currentArrayForm.emit(JSON.stringify(this.formatData));
  }
}
