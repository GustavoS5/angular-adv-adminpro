import { Component, Input } from '@angular/core';
import { Color, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent {
  @Input() titulo: string = 'Sin Titulo';

  @Input('labels') public doughnutChartLabels: Label[] = ['Null', 'Null', 'Null'];
  @Input('data') public doughnutChartData: MultiDataSet = [[50, 50, 50]];

  public colors: Color[] = [
    { backgroundColor: ['#6857E6', '#009FEE', '#F02059'] },
  ];
}
