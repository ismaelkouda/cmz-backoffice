import { Justificatif } from './../../../../../shared/enum/Justificatif.enum';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProvisionningService } from '../../data-access/provisionning.service';
import { ToastrService } from 'ngx-toastr';
import { formDataBuilder } from 'src/shared/constants/formDataBuilder.constant';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MappingService } from 'src/shared/services/mapping.service';
import { environment } from 'src/environments/environment.prod';
@Component({
    selector: 'app-credit-form',
    templateUrl: './credit-form.component.html',
    styleUrls: ['./credit-form.component.scss'],
})
export class CreditFormComponent implements OnInit {
    @Output() formsView = new EventEmitter();
    @Input() currentObject;
    @Output() listCredits = new EventEmitter();
    @Output() ligneCreditStat = new EventEmitter();
    public listTypeJustificatif: Array<any> = [];
    public selectedType: string;
    public selectedJustificatif: any = undefined;
    public selectedMontant: any;
    public selectedDescription: any;
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public fileUrl: string;
    public siteKey: string;
    creditForm: FormGroup;

    constructor(
        private provisionningService: ProvisionningService,
        private toastrService: ToastrService,
        private fb: FormBuilder,
        private mappingService: MappingService
    ) {
        Object.values(Justificatif).forEach((item) => {
            this.listTypeJustificatif.push(item);
        });
    }

    ngOnInit() {
        this.siteKey = environment.recaptcha.siteKey;
        this.fileUrl = this.mappingService.fileUrl;
        this.isFilter();
        this.initForm();
        if (this.currentObject !== undefined) {
            this.onFormPachValues();
        }
    }

    public GetAllLigneCredits() {
        this.provisionningService.GetAllLigneCredits({}, this.p).subscribe({
            next: (res) => {
                this.listCredits.emit(res.data.data);
                this.OnStatCredit();
            },
            error: (err) => {
                this.toastrService.error(err.message);
            },
        });
    }
    public OnStatCredit() {
        this.provisionningService.OnStatCredit({}).subscribe({
            next: (res) => {
                this.ligneCreditStat.emit(res['data']);
                this.close();
            },
            error: (err) => {
                this.toastrService.error(err.message);
            },
        });
    }

    public initForm() {
        this.creditForm = this.fb.group({
            operation: [''],
            montant: ['', [Validators.required]],
            type_justificatif: ['', [Validators.required]],
            justificatif: [''],
            description: ['', [Validators.required]],
        });
    }
    public OnSaveCredit() {
        this.creditForm.patchValue({
            operation: 'provisionning',
            justificatif: this.selectedJustificatif,
        });
        const formdata = formDataBuilder(this.creditForm.value);
        this.provisionningService.OnSaveCredit(formdata).subscribe({
            next: (response) => {
                this.GetAllLigneCredits();
            },
            error: (error) => {
                this.toastrService.error(error.error.message);
            },
        });
    }

    public onFormPachValues(): void {
        this.creditForm.get('montant').patchValue(this.currentObject?.montant);
        this.creditForm
            .get('type_justificatif')
            .patchValue(this.currentObject?.type_justificatif);
        this.creditForm
            .get('description')
            .patchValue(this.currentObject?.description);

        if (this.currentObject.show) {
            this.creditForm.disable();
        }
    }

    public close(): void {
        this.formsView.emit(false);
    }

    public onChangeFile(file: FileList) {
        this.selectedJustificatif = file.item(0);
    }

    public isFilter(): boolean {
        return !this.selectedMontant ||
            !this.selectedDescription ||
            !this.selectedJustificatif ||
            !this.selectedType
            ? true
            : false;
    }
}
