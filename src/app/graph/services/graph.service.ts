import { Graph } from './../models/Graph';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class GraphService {

  constructor() { }

  /** Validate a graph. Returns an array of errors. An empty array if graph is ok. */
  public validateGraph (graph: Graph): String[] {
    const errors: String[] = [];

    let beginFound = false;
    let endFound = false;


    graph.nodes.forEach(node => {
      const isStart: Boolean = graph.links.filter(link => link.end === node.name).length === 0;
      const isEnd: Boolean = graph.links.filter(link => link.start === node.name).length === 0;

      if (isStart && isEnd) {
        // Error. Its an isolated node.
        errors.push(node.name + ' is an isolated node.');
      } else if (isStart) {
        if (beginFound) {
          errors.push('there is more than one starting node');
        }
        beginFound = true;
      } else if (isEnd) {
        if (endFound) {
          errors.push('there is more than one ending node');
        }
        endFound = true;
      }
    });
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

  public loadGraph(graphName: string): Graph {
    return <Graph>JSON.parse(window.localStorage.getItem(graphName));
  }
}
