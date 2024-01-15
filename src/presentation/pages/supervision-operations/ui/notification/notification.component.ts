import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public initialView: boolean = true;
  public listNotifys: Array<any> = [];

  constructor(
    private route: ActivatedRoute,
    private mappingService: MappingService,
  ) {
    this.listNotifys = [
      {
        id: 1,
        type: 'Activation',
        ref: 'ACT01200240111202105',
        created_at: '2024-01-10 10:10:10'
      },
      {
        id: 1,
        type: 'Résiliation',
        ref: 'RES01200240111201605',
        created_at: '2024-01-10 10:10:00'
      },
      {
        id: 1,
        type: 'Suspension',
        ref: 'SUS01200240112113400',
        created_at: '2024-01-10 10:10:30'
      },
    ]
  }

  ngOnInit() {

  }

}
