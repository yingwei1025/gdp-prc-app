// GDP-PRC-Project
// Author: yingwei1025@gmail.com

import { AppConstant } from './app.constants';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: AppConstant.UP_HOME_PAGE,
    pathMatch: 'full'
  },
  {
    path: AppConstant.UP_HOME_PAGE,
    component: HomePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
