import { ApplicationType } from './../../../../../shared/enum/ApplicationType.enum';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-rapport-conformite',
  templateUrl: './rapport-conformite.component.html',
  styleUrls: ['./rapport-conformite.component.scss']
})
export class RapportConformiteComponent implements OnInit {

  public module: string;
  public subModule: string;
  public rapport: any;
  public currentTabsIndex: number = 0;

  public activation: string = OperationTransaction.ACTIVATION;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public swap: string = OperationTransaction.SWAP;
  public volume: string = OperationTransaction.VOLUME_DATA;


  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[1];
    });
    this.IsPatrimoineType()
  }

  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
    for (const key in this.rapport) {
      if (this.rapport.hasOwnProperty(key)) {
          this.rapport[key] = '0';
      }
  }
  }
  IsPatrimoineType(){
    return (this.mappingService.applicationType === ApplicationType.PATRIMOINESIM) ? true : false
  }
  public OnPushRapport(event: any): void {
    this.rapport = event;
  }
}
