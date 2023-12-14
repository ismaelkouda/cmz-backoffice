import { Component, OnInit } from '@angular/core';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  
  public today: number = Date.now();
  public appName: string;

  constructor(
    private mappingService: MappingService
  ) {

    this.appName = this.mappingService.appName;
  }

  ngOnInit(): void {
  }

}
