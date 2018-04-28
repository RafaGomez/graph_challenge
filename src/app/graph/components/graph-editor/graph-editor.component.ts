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
    if (changes["graphModel"] != null) //Library calls ngOnChanges every time user change graph.
    {
      //Translate domain graph model into library graph model
      let nodes = [];
      this.graphModel.nodes.forEach(nod => {
        nodes.push({
          key: nod.name,
          text: nod.description,
          color: this.getColorFromType(nod.type)
        });
      });

      let links = [];
      this.graphModel.links.forEach(link => {
        links.push({
          from: link.start,
          to: link.end
        });
      });
      this.model = new go.GraphLinksModel(nodes, links);
      this.diagram.model = this.model;
      this.diagram.div = this.diagramRef.nativeElement;
      this.palette.div = this.paletteRef.nativeElement;
    }

  }

  saveGraph(){
    //Translate library graph model into domain graph model
    let gr = <Graph> {};
    gr.nodes = this.diagram.model.nodeDataArray.map(val => <INode>{
      name: val["key"],
      type: this.getTypeFromColor(val["color"]),
      description: val["text"]
    });

    gr.links = this.diagram.model["linkDataArray"].map(val => <ILink>{
      start: val.from,
      end: val.to
    });
    gr.name = "test";

    this.saveRequested.emit(gr);
  }

  private getTypeFromColor (color: string): NodeTypeEnum{
    let result: NodeTypeEnum;
    switch (color) {
      case "lightblue":
        result = NodeTypeEnum.Init;
        break;
      case "orange":
        result = NodeTypeEnum.End;
        break;
      case "lightgreen":
        result = NodeTypeEnum.Action;
        break;
      case "pink":
        result = NodeTypeEnum.Condition;
        break;
      default:
        result = NodeTypeEnum.Action;
        break;
    }
    return result;
  }

  private getColorFromType (type: NodeTypeEnum): string {
    let result: string;
    switch (type) {
      case NodeTypeEnum.Init:
        result = 'lightblue';
        break;
      case NodeTypeEnum.End:
        result = 'orange';
        break;
      case NodeTypeEnum.Action:
        result = 'lightgreen';
        break;
      case NodeTypeEnum.Condition:
        result = 'pink';
        break;
      default:
        result = 'lightgreen';
        break;
    }
    return result;
  }

}
