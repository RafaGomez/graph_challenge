import { LoginComponent } from './../../auth/containers/login/login.component';
import { AuthModule } from './../../auth/auth.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'graph',
    loadChildren: '../../graph/graph.module#GraphModule' // Lazy loaded module
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
