import { Component, Input } from "@angular/core";

@Component({
  selector: "app-stat-box",
  templateUrl: "./stat-box.component.html",
  styleUrls: ["./stat-box.component.scss"],
})
export class StatBoxComponent {

  @Input() cardBgColor: any;
  @Input() cardBorderColor: any;
  @Input() legendColor: any;
  @Input() countColor: any;
  @Input() legend: string;
  @Input() count: any;
  @Input() icon: any;


  constructor() { }

  ngOnInit(): void {
  }

  pipeValue(number: any) {
    return new Intl.NumberFormat('fr-FR').format(number);
  }

}

