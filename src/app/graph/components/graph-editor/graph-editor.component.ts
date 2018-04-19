import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Input, Output, OnChanges, ChangeDetectionStrategy, SimpleChanges } from '@angular/core';
import * as go from 'gojs';
import { Graph } from '../../models/Graph';
import { NodeTypeEnum, INode } from '../../models/Node';
import { ILink } from '../../models/Link';

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GraphEditorComponent implements OnInit, OnChanges {
  private diagram: go.Diagram = new go.Diagram();
  private palette: go.Palette = new go.Palette();

  @ViewChild('diagramDiv')
  private diagramRef: ElementRef;

  @ViewChild('paletteDiv')
  private paletteRef: ElementRef;

  @Input()
  graphModel: Graph;
  //get model(): go.Model { return this.diagram.model; }
  //set model(val: go.Model) { this.diagram.model = val; }

  @Input()
  validationErrors: String[];
  
  @Output()
  nodeSelected = new EventEmitter<go.Node|null>();

  @Output()
  modelChanged = new EventEmitter<go.ChangedEvent>();

  @Output()
  saveRequested = new EventEmitter<Graph>();

  model: go.Model;

  constructor() {
    const $ = go.GraphObject.make;
    this.diagram = new go.Diagram();
    this.diagram.initialContentAlignment = go.Spot.Center;
    this.diagram.allowDrop = true;  // necessary for dragging from Palette
    this.diagram.undoManager.isEnabled = true;
    this.diagram.addDiagramListener("ChangedSelection",
        e => {
          const node = e.diagram.selection.first();
          this.nodeSelected.emit(node instanceof go.Node ? node : null);
        });
    this.diagram.addModelChangedListener(e => e.isTransactionFinished && this.modelChanged.emit(e));

    this.diagram.nodeTemplate =
      $(go.Node, "Auto",
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        $(go.Shape,
          {
            fill: "white", strokeWidth: 0,
            portId: "", cursor: "pointer",
            // allow many kinds of links
            fromLinkable: true, toLinkable: true,
            fromLinkableSelfNode: true, toLinkableSelfNode: true,
            fromLinkableDuplicates: true, toLinkableDuplicates: true
          },
          new go.Binding("fill", "color")),
        $(go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text").makeTwoWay())
      );

    this.diagram.linkTemplate =
      $(go.Link,
        // allow relinking
        { relinkableFrom: true, relinkableTo: true },
        $(go.Shape),
        $(go.Shape, { toArrow: "OpenTriangle" })
      );

    this.palette = new go.Palette();
    this.palette.nodeTemplateMap = this.diagram.nodeTemplateMap;

    // initialize contents of Palette
    this.palette.model.nodeDataArray =
      [
        { text: "Start", color: "lightblue" },
        { text: "End", color: "orange" },
        { text: "Action", color: "lightgreen" },
        { text: "Condition", color: "pink" },
      ];
  }

  ngOnInit() {

  }

  ngOnChanges(changes:SimpleChanges){
    if (changes["graphModel"] != null)
    {
      //Translate domain graph model into library graph model
      let nodes = [];
      this.graphModel.nodes.forEach(nod => {
        nodes.push({
          key: nod.name,
          text: nod.description,
          color: "orange" //TODO: Change color for each node type.
        })
      });

      let links = [];
      this.graphModel.links.forEach(link => {
        links.push({
          from: link.start,
          to: link.end
        });
      });
      this.model = new go.GraphLinksModel(nodes, links);
      console.log("model =>", this.model);
      this.diagram.model = this.model;
      this.diagram.div = this.diagramRef.nativeElement;
      this.palette.div = this.paletteRef.nativeElement;
    }

  }

  saveGraph(){
    //Translate library graph model into domain graph model    
    console.log ("model", this.diagram.model);
    let gr = <Graph> {};
    gr.nodes = this.diagram.model.nodeDataArray.map(val => <INode>{
      name: val["key"],
      type: NodeTypeEnum.Action,
      description: val["text"] 
    });

    gr.links = this.diagram.model["linkDataArray"].map(val => <ILink>{
      start: val.from,
      end: val.to
    });
    gr.name = "test";
  
    this.saveRequested.emit(gr);
  }


}
