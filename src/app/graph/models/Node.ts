export interface INode {
  name: String;
  type: NodeTypeEnum;
  description: String;
}

export enum NodeTypeEnum {
  Init = 1,
  Condition,
  Action,
  End
}
