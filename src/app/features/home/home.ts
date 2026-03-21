import { Chart } from '@amcharts/amcharts5';
import { Component } from '@angular/core';
import { MyChart } from '../../components/chart/chart';
import { Header } from '../../components/header/header';
import { Blog } from '../../components/blog/blog';
import { Menu } from '../../components/menu/menu';

@Component({
  selector: 'app-home',
  imports: [MyChart, Blog],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
