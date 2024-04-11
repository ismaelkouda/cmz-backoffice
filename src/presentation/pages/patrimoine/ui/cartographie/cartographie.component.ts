import { Component, OnInit } from '@angular/core';
import { MappingService } from './../../../../../shared/services/mapping.service';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ActivatedRoute } from '@angular/router';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-cartographie',
  templateUrl: './cartographie.component.html',
  styleUrls: ['./cartographie.component.scss']
})
export class CartographieComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentData: any;
  public listPatrimoines: any;
  public datas: any;
  public map: any;
  public isMaximized: boolean = false;
  public display: boolean = false;
  public currentComposant: any;
  public listFirstLeveDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedNiveauTrois: string;
  public selectedZone: string;
 public firstLevelLibelle: string;
 public secondLevelLibelle: string;
 public thirdLevelLibelle: string;
 public applicationType: string;
 public patrimoineType: string;
    public title = 'Cartographie - Système de Gestion de Collecte Centralisée';

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private route: ActivatedRoute,
    public mappingService: MappingService,
    private http: HttpClient,
    private titleService: Title
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
      this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.isFilter();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[5];
    });
  }
  OnRefresh() {
    
  }
  public GetAllFirstLevel() {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listFirstLeveDatas = response['data'].map(element => {
            return { ...element, fullName: `${element.nom}` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onChangeFirstLvel(event: any) {
    this.selectedDirection = event.value;
    this.listSecondLevelDatas = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom}` }
    });
  }
  public GetAllThirdLevel() {
    this.settingService
      .GetAllThirdSimple({})
      .subscribe({
        next: (response) => {
          this.listThirdLevelDatas = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onFilter(){
    this.http.get("assets/datas.json")
    .subscribe((res: any) => {

      console.log("res",res);
      
        this.datas = res;
        this.display = true
        this.onDialogMaximized(true);
     });
  }
  handleClose() {
    this.display = false;    
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedZone && !this.selectedNiveauTrois) ? true : false
  }
}



