import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../components/header/header';
import { Menu } from '../components/menu/menu';

@Component({
  selector: 'app-layout',
  imports: [RouterModule, Header, Menu],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
