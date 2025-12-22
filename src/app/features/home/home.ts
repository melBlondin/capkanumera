import { Chart } from '@amcharts/amcharts5';
import { Component } from '@angular/core';
import { MyChart } from '../../components/chart/chart';

@Component({
  selector: 'app-home',
  imports: [MyChart],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
