import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SettingService } from 'src/shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { PatrimoineService } from '../../data-access/patrimoine.service';

@Component({
  selector: 'app-patrimoine-forms',
  templateUrl: './patrimoine-forms.component.html',
  styleUrls: ['./patrimoine-forms.component.scss']
})
export class PatrimoineFormsComponent implements OnInit {

  @Output() listPatrimoines = new EventEmitter();
  public listDirectionRegionales: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listZones: Array<any> = [];
  public idDirectionRegionale: any;
  public listTypePersonne: Array<any> = [];
  public listUsage: Array<any> = [];
  public listDHCP: Array<any> = [];
  public listServices: Array<any> = [];
  public listProfils: Array<any> = [];
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;


  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  adminForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService
  ) {
    this.listTypePersonne = ['Morale', 'Physique'],
      this.listDHCP = ['OUI', 'NON'],
      this.listServices = ['DATA_VOLORISEE'],
      this.listProfils = ['Prepaid', 'Postpaid', 'Hybride'],
      this.listUsage = ['Compteur Prépayé', 'Terminal', 'Internet Personnel', 'Internet Backup']
  }

  ngOnInit() {
    this.initForm();
    this.getAllDirectionRegionales();
    this.getAllExploitation(this.currentObject?.direction_regionale.id,)
    //this.onGetExploitationValueChanges()
    //this.onGetDrValueChanges();

    if (this.currentObject !== undefined) {
      this.onFormPachValues();
      //this.getAllExploitation(this.currentObject?.direction_regionale?.id);
      //this.getAllZones(this.currentObject?.exploitation?.id);
    }
  }

  public close(): void {
    this.formsView.emit(false);
    this.adminForm.reset();
  }

  public initForm(): void {
    this.adminForm = this.fb.group({

      //Identification Controls
      direction_regionale: ['', [Validators.required]],
      exploitation: ['', [Validators.required]],
      imsi: ['', [
        Validators.required,
        //Validators.maxLength(10),
        //Validators.pattern('^[0-9]*$')
      ]],
      msisdn: ['', [
        Validators.required,
        //Validators.maxLength(10),
      ]],
      zone_geographique: [''],
      usage: [''],
      code_pin: ['', [
        Validators.required,
        //Validators.maxLength(4),
      ]],
      code_puk: ['', [
        Validators.required,
        //Validators.maxLength(5),
      ]],
      adresse_geographique: [''],
      nom_prenoms: ['', [Validators.required]],
      adresse_email: ['', [
        Validators.email,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]],
      longitude: [''],
      latitude: [''],

      //Reseaux Conrols
      categorie: [''],
      profil: [''],
      service: [''],
      site_bts: [''],

      //Trafic Controls
      apni: [''],
      username: [''],
      password: [''],
      dhcp: [''],
      adresse_ip: [''],
      proxy: ['', [
        Validators.required,
        //Validators.maxLength(8),
      ]]
    });
  }

  public getAllDirectionRegionales(): void {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirectionRegionales = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.message)
        }
      })
  }

  public GetAllPatrimoines() {
    this.patrimoineService
      .GetAllPatrimoines({}, this.p)
      .subscribe({
        next: (response) => {
          this.listPatrimoines = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public getAllExploitation(id: number) {
    const data = { direction_regionale_id: id };
    this.settingService
      .getAllExploiatations(data)
      .subscribe(
        (response: any) => {
          this.listExploitations = response['data'];
          this.listExploitations.forEach((element) => (element.all_exp = element.nom + ' ' + '[' + element.code + ']'));
          if (this.idDirectionRegionale !== undefined) {
            this.listZones = this.listExploitations[0]['zones'];
          }
        },
        (error) => {
          this.toastrService.error(error.message);
        }
      )
  }

  public getAllZones(id: number) {
    const data = { exploitation_id: id };
    this.settingService
      .getAllZones(data)
      .subscribe(
        (response: any) => {
          this.listZones = response['data'];
        },
        (error) => {
          this.toastrService.error(error.message);
        }
      );
  }

  handleSaveCampagne() {

  }
  handleUpdateCampagne() {
    this.adminForm.get('direction_regionale').disable();
    this.adminForm.get('exploitation').disable();
    this.patrimoineService
      .UpdatePatrimoine({
        ...this.adminForm.value,
        sim_id: this.currentObject?.id,
        direction_regionale_id: this.adminForm.get('direction_regionale').value,
        exploitation_id: this.adminForm.get('exploitation').value,
        zone_id: this.adminForm.get('zone').value,
      })
      .subscribe({
        next: (response) => {
          this.toastrService.success(response.message);
          this.GetAllPatrimoines();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onGetDrValueChanges() {
    return this.adminForm.get('direction_regionale').valueChanges.subscribe((value) => {
      console.log("valuevalue", value);

      this.getAllExploitation(value)
    });
  }
  onGetExploitationValueChanges() {
    return this.adminForm.get('exploitation').valueChanges.subscribe((value) => {
      this.getAllZones(value)
    });
  }

  public onFormPachValues(): void {

    //Identification Controls
    this.adminForm.get('direction_regionale').patchValue(this.currentObject?.direction_regionale.id);
    this.adminForm.get('exploitation').patchValue(this.currentObject?.exploitation.id);
    this.adminForm.get('imsi').patchValue(this.currentObject?.imsi);
    this.adminForm.get('msisdn').patchValue(this.currentObject?.msisdn);
    this.adminForm.get('zone_geographique').patchValue(this.currentObject?.zone_geographique);
    this.adminForm.get('usage').patchValue(this.currentObject?.usage);
    this.adminForm.get('code_pin').patchValue(this.currentObject?.code_pin);
    this.adminForm.get('code_puk').patchValue(this.currentObject?.code_puk);
    this.adminForm.get('code_puk').patchValue(this.currentObject?.code_puk);
    this.adminForm.get('adresse_geographique').patchValue(this.currentObject?.adresse_geographique);
    this.adminForm.get('nom_prenoms').patchValue(this.currentObject?.nom_prenoms);
    this.adminForm.get('adresse_email').patchValue(this.currentObject?.adresse_email);
    this.adminForm.get('longitude').patchValue(this.currentObject?.longitude);
    this.adminForm.get('latitude').patchValue(this.currentObject?.latitude);

    //Réseaux Controls
    this.adminForm.get('categorie').patchValue(this.currentObject?.categorie);
    this.adminForm.get('profil').patchValue(this.currentObject?.profil);
    this.adminForm.get('service').patchValue(this.currentObject?.service);
    this.adminForm.get('site_bts').patchValue(this.currentObject?.site_bts);

    //Trafic Controls
    this.adminForm.get('apni').patchValue(this.currentObject?.apni);
    this.adminForm.get('username').patchValue(this.currentObject?.username);
    this.adminForm.get('password').patchValue(this.currentObject?.password);
    this.adminForm.get('dhcp').patchValue(this.currentObject?.dhcp);
    this.adminForm.get('adresse_ip').patchValue(this.currentObject?.adresse_ip);
    this.adminForm.get('proxy').patchValue(this.currentObject?.proxy);
    if (this.currentObject.show) {
      this.adminForm.disable()
    }
  }

}      
