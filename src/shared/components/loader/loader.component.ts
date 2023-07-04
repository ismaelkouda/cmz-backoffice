import { Component, OnInit, OnDestroy } from '@angular/core';
import { EncodingDataService } from 'src/shared/services/encoding-data.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  public show: boolean = true;
  public profil: any;

  constructor(
    private storage: EncodingDataService
  ) {
    setTimeout(() => {
      this.show = false;
    }, 3000);
  }

  ngOnInit() {
    this.profil = JSON.parse(this.storage.getData('user'));
  }

  ngOnDestroy() { }

}
