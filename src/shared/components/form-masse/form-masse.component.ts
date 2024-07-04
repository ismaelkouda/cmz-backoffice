import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import readXlsxFile from "read-excel-file";
import Swal from 'sweetalert2';

type MODEL_ENTETE_FILE = ['MSISDN', 'IMSI', 'ICCID', 'ADRESSE IP', 'APN'];

@Component({
    selector: 'app-form-masse',
    templateUrl: './form-masse.component.html',
    styles: [`
    .input_file {
        align-items: center;
        position: relative;
        display: flex;
        overflow: hidden;
        border: solid .5px rgba(0, 0, 0, .5);
    }
    input {
        width: 1px;
        height: 1px;
        z-index: 1;
    }
    label {
        position: static;
        z-index: 2;
        background-color: #e1e1e1;
        margin-bottom: 0 !important;
        cursor: pointer;
        width: 100%;

        span {
            font-style: italic;
            margin-left: 10px;
        }
    }
    .isFile_backgroundGreen {
        background-color: rgb(86, 156, 91, 0.5) !important;
    }

    .isFile_backgroundRed {
        background-color: red;
    }

    `]
})

export class FormMasseComponent {
    @Output() dataToSend: EventEmitter<{}> = new EventEmitter<{}>();
    @Input() currentArrayHeaders: MODEL_ENTETE_FILE;
    public arrayHeaderExcelFile: Array<any> = [];
    public arrayContentExcelFile: Array<any> = [];
    public formatData: Array<any> = [];
    @Input() fileModel: any;
    @Input() typeOuvrage: any;
    @Input() displayModalAjoutEnMasse: boolean;
    public currentFile: any;
    public fileName: any;
    public data: File;

    constructor(private toastrService: ToastrService) { }

    // Debut: ajout du fichier excel au formulaire
    onExcelFileChange(event: FileList) {
        if (event.length != 0) {
            this.data = event[0]
            readXlsxFile(event[0]).then((rows) => {
                // debut: recuperer l'entete du fichier excel upload
                this.arrayHeaderExcelFile = rows[0];
                // fin: recuperer l'entete du fichier excel upload

                // debut: recuperer tout le contenu (le corps du fichier) du fichier excel upload
                this.arrayContentExcelFile = rows;
                // fin: recuperer tout le contenu (le corps du fichier) du fichier excel upload

                this.arrayContentExcelFile.shift(); // suuprime le premier objet qui est l'entete du tableau

                this.fileName = event[0]?.name.slice(0, 33).padEnd(36, '.');
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
        }

        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) return false;
        }
    }
    // Fin: Verifier le fichier excel ajouté au formulaire est conforme au fichier qu'on attends

    // Debut: Message sweetAlert a afficher quand le fichier excel upload est incorrecte
    messageFileIsNotCorrect(message: 'Structure du fichier incohérente'|'Structure du fichier cohérente', typeMessage: 'error'|'success') {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false,
        });
        swalWithBootstrapButtons.fire({
            title: this.typeOuvrage,
            icon: typeMessage,
            text: `${message}`,
            confirmButtonColor: '#F07427',
            confirmButtonText: 'ok',
        });
    }
    // Debut: Message sweetAlert a afficher quand le fichier excel upload est incorrecte

    // Debut: construction de l'object a envoyer au backend
    formatDataToSend() {
        this.arrayContentExcelFile.map((item) => {
            this.formatData.push({ ...this.arrayHeaderExcelFile.reduce((ac, key, i) => ({ ...ac, [key.toLowerCase()]: item[i] }), {}) })
        });
        this.onSendData();
    }
    // Fin: construction de l'object a envoyer au backend

    // Debut: Envoie de l'object au backend
    onSendData() {
        this.dataToSend.emit({ sims_file: this.data });
    }
    // Fin: Envoie de l'object au backend

    // Debut: Verification du fichier a upload
    checkFile() {
        const isFileCorrect = this.isArraySame(this.arrayHeaderExcelFile, this.currentArrayHeaders);
        if (isFileCorrect === false) {
            this.messageFileIsNotCorrect(`Structure du fichier incohérente`, 'error');
        } else {
            this.messageFileIsNotCorrect(`Structure du fichier cohérente`, 'success');
            this.formatDataToSend();
        }
    }
    // Fin: Verification du fichier a upload

    downloadModelXls() {
        window.open(this.fileModel, "_blank");
    }
}