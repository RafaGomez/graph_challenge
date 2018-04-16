import { GraphRoutingModule } from './grap-routing.module';
import { GraphContainerComponent } from './containers/graph-container/graph-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    GraphRoutingModule
  ],
  declarations: [GraphContainerComponent]
})
export class GraphModule { }
