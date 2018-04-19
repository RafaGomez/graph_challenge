import { ILink } from './Link';
import { INode } from './Node';
export interface Graph {
  nodes: INode[];
  links: ILink[];
  name: String;
}
