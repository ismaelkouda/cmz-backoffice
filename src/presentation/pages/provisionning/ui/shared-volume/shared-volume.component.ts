import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shared-volume',
  templateUrl: './shared-volume.component.html',
  styleUrls: ['./shared-volume.component.scss']
})
export class SharedVolumeComponent implements OnInit {

  public selectedDescription: string;
  constructor() { }

  ngOnInit() {
  }

}
