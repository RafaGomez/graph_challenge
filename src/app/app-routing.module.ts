import { AuthModule } from './auth/auth.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/containers/login/login.component';
import { GraphModule } from './graph/graph.module';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'graph',
    loadChildren: './graph/graph.module#GraphModule'// => Fixing angular bug
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
