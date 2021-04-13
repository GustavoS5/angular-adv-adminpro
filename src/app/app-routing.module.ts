import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoPageFoundComponent } from './no-page-found/no-page-found.component';
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   loadChildren: () =>
  //     import('./pages/pages.module').then((m) => m.PagesModule),
  // },

  // {
  //   path: 'auth',
  //   loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  // },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NoPageFoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule,
    AuthRoutingModule,
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
