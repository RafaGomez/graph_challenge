import { Component, OnInit } from '@angular/core';
import * as go from 'gojs';
import { Graph } from '../../models/Graph';
import { GraphService } from '../../services/graph.service';
import { INode, NodeTypeEnum } from '../../models/Node';
import { ILink } from '../../models/Link';

@Component({
  selector: 'app-graph-container',
  templateUrl: './graph-container.component.html',
  styleUrls: ['./graph-container.component.scss']
})
export class GraphContainerComponent implements OnInit {

  title = 'Graph challenge';

  model = new go.GraphLinksModel(
    [
      { key: "Alpha", text: "Alpha", color: "lightblue" },
      { key: "Beta", text: "Beta", color: "orange" },
      { key: "Gamma", text: "Gamma", color: "lightgreen" },
      { key: "Delta", text: "Delta", color: "pink" }
    ],
    [
      { from: "Alpha", to: "Beta" },
      { from: "Alpha", to: "Gamma" },
      { from: "Beta", to: "Beta" },
      { from: "Gamma", to: "Delta" },
      { from: "Delta", to: "Alpha" }
    ]);

  data: any;
  graph: Graph;
  validationResult: String[] = []

  constructor( private graphService: GraphService) { }

  ngOnInit() {
    let gr:Graph = this.graphService.loadGraph("test");
    if (gr == null){
      //There is no saved graph. Load a basic one
      gr = <Graph>{};
      gr.nodes = [<INode>{name:"start", description:"start",type:NodeTypeEnum.Init}, {name:"end", description:"end", type:NodeTypeEnum.End}];
      gr.links = [<ILink>{start:"start", end:"end"}];
      gr.name = "test";
    }
    this.showDetails(gr);
  }


  showDetails(graph: Graph | null) {
    this.graph = graph;
  }


  saveGraph(graph: Graph){
    this.validationResult = this.graphService.validateGraph(graph);
    if (this.validationResult.length == 0){
      this.graphService.saveGraph(graph);
    }

    console.log("Validation", this.validationResult);
  }

}
