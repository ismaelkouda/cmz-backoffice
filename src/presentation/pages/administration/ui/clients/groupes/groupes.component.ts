import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-groupes',
    templateUrl: './groupes.component.html',
    styleUrls: ['./groupes.component.scss'],
})
export class GroupesComponent implements OnInit {
    public module: string;
    public subModule: string;
    public initialView: boolean = true;
    public formsView: boolean = false;
    public currentObject: any;
    public listGroupeContacts: Array<any> = [];
    public listContacts: Array<any> = [];
    public totalPage: 0;
    public totalRecords: 0;
    public recordsPerPage: 0;
    public offset: any;
    public p: number = 1;
    public filterDateStart: Date;
    public filterDateEnd: Date;
    public selectDateStart: any;
    public selectDateEnd: any;
    public groupeForm: FormGroup;
    public memeberForm: FormGroup;
    public title =
        'Groupes clients - Système de Gestion de Collecte Centralisée';
    constructor(
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private modalService: NgbModal,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
        this.listGroupeContacts = [
            {
                id: 1,
            },
            {
                id: 2,
            },
        ];
        this.listContacts = [
            {
                id: 1,
                nom: 'contact_1',
            },
            {
                id: 2,
                nom: 'contact_2',
            },
        ];
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[6];
        });
        this.OnInitGroupeForm();
        this.OnInitMemberForm();
    }

    /**@@@@@@@@@@@@@@@@@@@ Groupe Forms @@@@@@@@@@@@@@@@@@@@@ */
    OnInitGroupeForm() {
        this.groupeForm = this.fb.group({
            nom: ['', [Validators.required]],
            description: ['', [Validators.required]],
        });
    }
    openGroupeForm(content) {
        this.modalService.open(content);
    }
    hideGroupeForm() {
        this.modalService.dismissAll();
        this.groupeForm.reset();
    }

    /**@@@@@@@@@@@@@@@@@@@ Member Forms @@@@@@@@@@@@@@@@@@@@@ */

    OnInitMemberForm() {
        this.memeberForm = this.fb.group({
            contacts: ['', [Validators.required]],
        });
    }
    openMemberForm(member) {
        this.modalService.open(member);
    }
    hideMemberForm() {
        this.modalService.dismissAll();
        this.memeberForm.reset();
    }

    public onInitForm(): void {
        this.initialView = false;
        this.formsView = true;
        this.currentObject = undefined;
    }

    public pushStatutView(event: boolean): void {
        this.formsView = event;
        this.initialView = !event;
    }
    public pushListClients(event: any): void {
        this.listGroupeContacts = event;
    }
}
