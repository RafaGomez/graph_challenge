import { Graph } from "./../models/Graph";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { NodeTypeEnum } from "../models/Node";

@Injectable()
export class GraphService {
  constructor() {}

  /** Validate a graph. Returns an array of errors. An empty array if graph is ok. */
  public validateGraph(graph: Graph): String[] {
    let errors: String[] = [];

    let beginFound = false;
    let endFound = false;

    errors = [...errors, ...this.validateNodeTypes(graph)];
    // Only continues the validation if everything is ok at this point.
    if (errors.length === 0) {
      errors = [...errors, ...this.validateLinks(graph)];
    }

    return errors;
  }

  public saveGraph(graph: Graph): Boolean {
    let ok: Boolean = true;
    ok = this.validateGraph(graph).length === 0;
    if (ok) {
      window.localStorage.setItem(graph.name.toString(), JSON.stringify(graph));
      return true;
    } else {
      return false;
    }
  }

  /** VAlidations related to node types. */
  private validateNodeTypes(graph: Graph): String[] {
    //Graph contains at least one node of each type.
    let errors: String[] = [];
    let index = 0;
    let startNodes = 0;
    let endNodes = 0;
    let actionFound = false;
    let conditionFound = false;
    while (index < graph.nodes.length) {
      startNodes =
        graph.nodes[index].type === NodeTypeEnum.Init
          ? startNodes + 1
          : startNodes;
      endNodes += graph.nodes[index].type === NodeTypeEnum.End ? 1 : 0;
      actionFound =
        actionFound || graph.nodes[index].type === NodeTypeEnum.Action;
      conditionFound =
        conditionFound || graph.nodes[index].type === NodeTypeEnum.Condition;
      index++;
    }
    if (!(actionFound && conditionFound && startNodes > 0 && endNodes > 0)) {
      errors.push(
        "A Workflow should have at least a Init, End, Condition an Action node."
      );
    }
    if (startNodes > 1) {
      errors.push("A Workflow cannot have more than one start node.");
    }
    if (endNodes > 1) {
      errors.push("A Workflow cannot have more than one ending node.");
    }
    return errors;
  }

  /** VAlidations related to node links. */
  private validateLinks(graph: Graph): String[] {
    let errors: String[] = [];

    for (let node of graph.nodes) {
      let inboundLinks = 0;
      let outboundLinks = 0;

      for (let i = 0; i < graph.links.length; i++) {
        const link = graph.links[i];
        if (link.start === link.end) {
          errors.push(`${node.description} cannot have a link to itself.`);
        }
        if (link.start === node.name) {
          outboundLinks++;
        }
        if (link.end === node.name) {
          inboundLinks++;
        }
      }
      switch (node.type) {
        case NodeTypeEnum.Init:
          if (inboundLinks > 0) {
            errors.push("Start node cannot have a inbound link.");
          }
          if (outboundLinks == 0) {
            errors.push("Start node must have at least one outbound link.");
          }
          break;
        case NodeTypeEnum.End:
          if (outboundLinks > 0) {
            errors.push("End node cannot have a outbound link.");
          }
          if (inboundLinks == 0) {
            errors.push("End node must have at least one inbound link.");
          }
          break;
        default:
          if (outboundLinks === 0 || inboundLinks === 0) {
            errors.push(
              `${node.description} node must have at least one inbound and outbound link.`
            );
          }
          break;
      }
    }

    return errors;
  }

  public loadGraph(graphName: string): Graph {
    return <Graph>JSON.parse(window.localStorage.getItem(graphName));
  }
}
