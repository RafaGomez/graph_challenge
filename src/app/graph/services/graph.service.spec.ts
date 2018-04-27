import { NodeTypeEnum } from '../models/Node';
import { Graph } from './../models/Graph';
import { TestBed, inject } from '@angular/core/testing';

import { GraphService } from './graph.service';

describe('GraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraphService]
    });
  });

  it('should be created', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
  }));

  it ('should validate a correct graph', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const okGraph: Graph = {
      name: 'correct graph',
      nodes: [{name: 'start', type: NodeTypeEnum.Init, description:'start'},
      {name: 'condition', type: NodeTypeEnum.Condition, description:'condition'},
              {name: 'action1', type: NodeTypeEnum.Action, description:'action 1'},              
              {name: 'action2', type: NodeTypeEnum.Action, description:'action 2'},
              {name: 'end', type: NodeTypeEnum.End, description:'end'}],
      links: [{start: 'start', end: 'condition'},
              {start: 'condition', end: 'action 1'},
              {start: 'condition', end: 'action 2'},
              {start: 'action 1', end: 'end'}, 
              {start: 'action 2', end: 'end'}]
    };
    expect(service.validateGraph(okGraph).length).toBe(0);
  }));

  it ('should return error with more than one ending node', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const okGraph: Graph = {
      name: 'error graph',
      nodes: [{name: 'start', type: NodeTypeEnum.Init, description:'start'},
              {name: 'action A', type: NodeTypeEnum.Action, description:'action a'},
              {name: 'action B', type: NodeTypeEnum.Action, description:'action b'}],
      links: [{start: 'start', end: 'action A'},
              {start: 'start', end: 'action B'}]
    };
    expect(service.validateGraph(okGraph).length).toBeGreaterThan(0);
  }));

  it ('should return error with more than one starting node', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const okGraph: Graph = {
      name: 'error graph',
      nodes: [{name: 'start A', type: NodeTypeEnum.Init, description:'start A'},
              {name: 'start B', type: NodeTypeEnum.Init, description:'start B'},
              {name: 'action', type: NodeTypeEnum.Action, description:'action'}],
      links: [{start: 'start A', end: 'action'},
              {start: 'start B', end: 'action'}]
    };
    expect(service.validateGraph(okGraph).length).toBeGreaterThan(0);
  }));

  it ('should return error with an isolated node', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const okGraph: Graph = {
      name: 'error graph',
      nodes: [{name: 'start', type: NodeTypeEnum.Init, description:'start'},
              {name: 'end', type: NodeTypeEnum.End, description:'end'},
              {name: 'isolated', type: NodeTypeEnum.Action, description:'isolated'}],
      links: [{start: 'start', end: 'end'}]
    };
    expect(service.validateGraph(okGraph).length).toBeGreaterThan(0);
  }));

  it ('should not save a wrong graph', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const errGraph: Graph = {
      name: 'error graph',
      nodes: [{name: 'start', type: NodeTypeEnum.Init, description:'start'},
              {name: 'action A', type: NodeTypeEnum.Action, description:'action A'},
              {name: 'action B', type: NodeTypeEnum.Action, description:'actionB'}],
      links: [{start: 'start', end: 'action A'},
              {start: 'start', end: 'action B'}]
    };
    expect(service.saveGraph(errGraph)).toBe(false);
  }));

  it ('should save and load the same graph', inject([GraphService], (service: GraphService) => {
    expect(service).toBeTruthy();
    const okGraph: Graph = {
      name: 'correct graph',
      nodes: [{name: 'start', type: NodeTypeEnum.Init, description:'start'},
      {name: 'condition', type: NodeTypeEnum.Condition, description:'condition'},
              {name: 'action1', type: NodeTypeEnum.Action, description:'action 1'},              
              {name: 'action2', type: NodeTypeEnum.Action, description:'action 2'},
              {name: 'end', type: NodeTypeEnum.End, description:'end'}],
      links: [{start: 'start', end: 'condition'},
              {start: 'condition', end: 'action 1'},
              {start: 'condition', end: 'action 2'},
              {start: 'action 1', end: 'end'}, 
              {start: 'action 2', end: 'end'}]
    };
    expect(service.saveGraph(okGraph)).toBe(true);
    expect(service.loadGraph(okGraph.name.toString())).toBeDefined();
  }));

});
