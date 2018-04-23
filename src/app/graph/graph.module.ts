import { GraphRoutingModule } from './grap-routing.module';
import { GraphContainerComponent } from './containers/graph-container/graph-container.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphEditorComponent } from './components/graph-editor/graph-editor.component';
import { GraphService } from './services/graph.service';

@NgModule({
  imports: [
    CommonModule,
    GraphRoutingModule
  ],
  declarations: [GraphContainerComponent, GraphEditorComponent],
  providers: [GraphService]
})
export class GraphModule { }
