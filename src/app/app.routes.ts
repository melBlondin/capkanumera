import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { NotFound } from './features/not-found/not-found';
import { MessagesPage } from './features/messages-page/messages-page';
import { Layout } from './layout/layout';
import { featuresRoutes } from './features/features.routes';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: featuresRoutes,
  },
  /*{
    path: 'home',
    loadComponent: () => import('./features/home/home').then((m) => m.Home),
  },*/
  /*{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
  },*/
  {
    path: '**',
    component: NotFound,
  },
];
