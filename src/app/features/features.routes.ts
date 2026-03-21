import { Routes } from '@angular/router';
import { Home } from './home/home';
import { MessagesPage } from './messages-page/messages-page';
import { NotFound } from './not-found/not-found';

export const featuresRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },
  /*{
    path: 'home',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },*/
];
