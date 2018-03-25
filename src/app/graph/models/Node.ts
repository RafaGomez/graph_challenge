export interface Node {
  name: String;
  type: NodeTypeEnum;
}

export enum NodeTypeEnum {
  Init = 1,
  Condition,
  Action,
  End
}
