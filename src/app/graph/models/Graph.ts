import { Link } from './Link';
import { Node } from './Node';
export interface Graph {
  nodes: Node[];
  links: Link[];
  name: String;
}
