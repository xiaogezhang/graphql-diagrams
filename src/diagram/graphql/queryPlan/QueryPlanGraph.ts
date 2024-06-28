import {
  DiagramModel,
  DefaultLinkModel,
  DefaultPortModel,
} from '@projectstorm/react-diagrams';

import tinycolor from 'tinycolor2';

import {ListNodeModel} from '../../node/ListNodeModel';
import {SimpleTextListItemType} from '../../list/SimpleTextListItem';
import {
  ConditionNode,
  DeferNode,
  FetchNode,
  FlattenNode,
  ParallelNode,
  PlanNode,
  QueryPlan,
  QueryPlanFieldNode,
  QueryPlanInlineFragmentNode,
  QueryPlanSelectionNode,
  SequenceNode,
  SubscriptionNode,
} from '@apollo/query-planner';
import {TreeNode, layout} from '../../layout';
import {DocumentNode, Kind, parse, print, visit} from 'graphql';
import {
  MultiLineText,
  MultiLineTextListItemType,
} from '../../list/MultiLineTextListItem';

export function createQueryPlanGraph(queryPlanStr: string): DiagramModel {
  const diagramModel = new DiagramModel();
  const queryPlan = JSON.parse(queryPlanStr) as QueryPlan;
  process(diagramModel, queryPlan);

  return diagramModel;
}

const QueryPlanNodeColor = 'CornFlowerBlue';
const ParallelNodeColor: string = 'Cyan';
const ConditionNodeColor: string = tinycolor('LightCyan')
  .lighten(15)
  .toRgbString();
const FetchNodeColor: string = 'LimeGreen';
const VariablesColor: string = 'MediumSeaGreen'; //tinycolor(FetchNodeColor).lighten(20);
const RequireBackGroundColor: string = 'LightGreen';
const FlattenNodeColor: string = tinycolor('LightGreen')
  .lighten(15)
  .toRgbString();
const DeferNodeColor: string = tinycolor('Brown').lighten(50).toRgbString();
const SubscriptionNodeColor: string = 'SlateGrey';

const planLinkColor = 'CadetBlue';
const dependingLinkColor = 'ForestGreen';

function createTreeNode(nodeModel: ListNodeModel): TreeNode {
  const name = nodeModel.getOptions().name; 
  const treeNode = {
    node: nodeModel,
    rowsCount: 0,
    width: name
      ? (name.length ?? 0) + 2
      : 8,
    children: [],
  };
  return treeNode;
}

type ResultPorts = {
  treeNode?: TreeNode;
  outPorts: DefaultPortModel[];
  depth: number;
};

function processNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: PlanNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  switch (node.kind) {
    case 'Sequence':
      return processSequenceNode(
        diagramModel,
        parent,
        node as SequenceNode,
        fetchNodes,
        relation,
      );
    case 'Parallel':
      return processParallelNode(
        diagramModel,
        parent,
        node as ParallelNode,
        fetchNodes,
        relation,
      );
    case 'Fetch':
      return processFetchNode(
        diagramModel,
        parent,
        node as FetchNode,
        fetchNodes,
        relation,
      );
    case 'Condition':
      return processConditionNode(
        diagramModel,
        parent,
        node as ConditionNode,
        fetchNodes,
        relation,
      );
    case 'Defer':
      return processDeferNode(
        diagramModel,
        parent,
        node as DeferNode,
        fetchNodes,
        relation,
      );
    case 'Flatten':
      return processFlattenNode(
        diagramModel,
        parent,
        node as FlattenNode,
        fetchNodes,
        relation,
      );
    default:
      return {outPorts: [], depth: 0};
  }
}

function connectPorts(
  diagramModel: DiagramModel,
  linkColor: string,
  outPorts: DefaultPortModel[],
  inPort: DefaultPortModel,
  label?: string,
): void {
  outPorts.forEach((outPort) => {
    const link = outPort.link<DefaultLinkModel>(inPort);
    link.setWidth(2);
    link.setColor(linkColor);
    link.setLocked(true);
    if (label) {
      link.addLabel(label);
    }
    diagramModel.addLink(link);
  });
}

function processSequenceNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: SequenceNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const steps = node.nodes;
  const stepPorts: ResultPorts[] = [];
  let ports = parent;
  steps.forEach((step, index) => {
    const curPorts = processNode(
      diagramModel,
      ports,
      step,
      fetchNodes,
      index === 0 ? relation : undefined,
    );
    stepPorts.push(curPorts);
    ports = curPorts;
  });
  const len = stepPorts.length;
  if (len === 0) {
    return parent;
  }
  return {
    outPorts: stepPorts[len - 1].outPorts,
    treeNode: stepPorts[len - 1].treeNode,
    depth: stepPorts[len - 1].depth,
  };
}

function createAndConnect(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  name: string,
  color: string,
  relation?: string,
): ResultPorts {
  const nodeModel = new ListNodeModel({
    name: name,
    color: color,
  });
  const inPort = nodeModel.addInPort('in');
  nodeModel.setInPort(inPort);
  inPort.setLocked(true);
  const outPort = nodeModel.addOutPort('out');
  nodeModel.setOutPort(outPort);
  outPort.setLocked(true);
  const treeNode = createTreeNode(nodeModel);

  const parentTreeNode = parent.treeNode;
  const parentOutPorts = parent.outPorts;
  const parentDepth = parent.depth;
  if (parentOutPorts) {
    connectPorts(diagramModel, planLinkColor, parentOutPorts, inPort, relation);
  }
  if (parentTreeNode) {
    parentTreeNode.children.push(treeNode);
  }
  diagramModel.addNode(nodeModel);
  return {
    treeNode: treeNode,
    outPorts: [outPort],
    depth: parentDepth + 1,
  };
}

function processParallelNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: ParallelNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const curParent = createAndConnect(
    diagramModel,
    parent,
    'Parallel',
    ParallelNodeColor,
    relation,
  );
  const threads = node.nodes;
  const outPorts: DefaultPortModel[] = [];
  let maxDepth = curParent.depth;
  let curTreeNode = curParent.treeNode;
  threads.forEach((thread) => {
    const curPorts = processNode(diagramModel, curParent, thread, fetchNodes);
    if (curPorts.outPorts) {
      outPorts.push(...curPorts.outPorts);
    }
    if (curPorts.depth > maxDepth) {
      maxDepth = curPorts.depth;
      curTreeNode = curPorts.treeNode;
    }
  });

  return {outPorts: outPorts, treeNode: curTreeNode, depth: maxDepth};
}

function processFetchNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: FetchNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const curParent = createAndConnect(
    diagramModel,
    parent,
    'Fetch (' + node.serviceName + ')',
    FetchNodeColor,
    relation,
  );
  const curParentTreeNode = curParent.treeNode;
  const kindRow = curParentTreeNode?.node.createItem(SimpleTextListItemType);
  const kindStr = node.operationKind + ': ' + (node.operationName ?? '');
  kindRow?.setContent({
    label: kindStr,
    backgroundColor: FetchNodeColor,
  });
  if (curParentTreeNode) {
    curParentTreeNode.rowsCount++;
  }
  let maxWidth = curParentTreeNode?.width ?? 0;
  if (kindStr.length > maxWidth) {
    maxWidth = kindStr.length;
  }
  if (node.variableUsages && node.variableUsages.length > 0) {
    const varsRow = curParentTreeNode?.node.createItem(
      MultiLineTextListItemType,
    );
    const varsLines: string[] = [];
    varsLines.push('Variable Usages: ');
    if (maxWidth < 17) {
      maxWidth = 17;
    }
    node.variableUsages.forEach(variable => {
      varsLines.push(singleIndent + singleIndent + variable);
      if (variable.length + 4 > maxWidth) {
        maxWidth = variable.length + 4;
      }
    });
    const varsContent: MultiLineText = {
      content: varsLines,
      backgroundColor: VariablesColor,
      initNumberOfRows: 3,
    };
    varsRow?.setContent(varsContent);
    if (curParentTreeNode) {
      curParentTreeNode.rowsCount += node.variableUsages.length + 1;
    }
  }

  const requires: QueryPlanSelectionNode[] | undefined = node.requires;
  
  if (requires && requires.length > 0 && curParent.treeNode) {
    const selections = ['Requires: '];
    selections.push('{');
    selections.push(...printQueryPlanSelections(singleIndent, requires));
    selections.push('}');
    const requiresRow = curParent.treeNode.node.createItem(MultiLineTextListItemType);
    const requiresContent: MultiLineText = {
      content: selections,
      backgroundColor: RequireBackGroundColor,
      initNumberOfRows: 3,
    };
    for (let i = 0; i < 3 && i < selections.length; i++) {
      if (maxWidth < selections[i].length) {
        maxWidth = selections[i].length;
      }
    }
    requiresRow.setContent(requiresContent);
    curParent.treeNode.rowsCount += 3;
  }
    
  const row = curParentTreeNode?.node.createItem(MultiLineTextListItemType);
  const operationStr = print(flattenEntitiesField(parse(node.operation)));
  const lines = operationStr.split(/\r?\n/);
  const content: MultiLineText = {
    content: lines,
    backgroundColor: FetchNodeColor,
    initNumberOfRows: 12,
  };
  for (let i = 0; i < 15 && i < lines.length; i++) {
    if (maxWidth < lines[i].length) {
      maxWidth = lines[i].length;
    }
  }
  row?.setContent(content);
  if (curParentTreeNode) {
    curParentTreeNode.rowsCount += 15;
  }
  if (node.id && curParentTreeNode?.node) {
    fetchNodes.set(node.id, curParentTreeNode.node);
  }
  if (curParentTreeNode) {
    curParentTreeNode.width = maxWidth;
  }
  return curParent;
}

function processConditionNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: ConditionNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const curParent = createAndConnect(
    diagramModel,
    parent,
    'Condition',
    ConditionNodeColor,
    relation,
  );
  const nodeModel = curParent.treeNode?.node;
  const outPort = nodeModel?.addOutPort('condition');
  const row = nodeModel?.createItem(SimpleTextListItemType);
  if (curParent.treeNode) {
    curParent.treeNode.rowsCount++;
  }
  row?.setOutPort(outPort);
  outPort?.setLocked(true);
  row?.setContent({
    label: node.condition,
    backgroundColor: ConditionNodeColor,
  });
  const newParent: ResultPorts = {
    treeNode: curParent.treeNode,
    depth: curParent.depth,
    outPorts: outPort? [outPort] : [],
  };
  const ifNode = node.ifClause
    ? processNode(diagramModel, newParent, node.ifClause, fetchNodes, 'if')
    : null;
  const elseNode = node.elseClause
    ? processNode(diagramModel, newParent, node.elseClause, fetchNodes, 'else')
    : null;
  const outPorts: DefaultPortModel[] = [];
  let treeNode = curParent.treeNode;
  let depth = curParent.depth;
  if (ifNode) {
    ifNode.outPorts && outPorts.push(...ifNode.outPorts);
    treeNode = ifNode.treeNode;
    depth = ifNode.depth;
  }
  if (elseNode) {
    elseNode.outPorts && outPorts.push(...elseNode.outPorts);
    treeNode = elseNode.treeNode;
    depth = elseNode.depth;
  }
  return {treeNode: treeNode, depth: depth, outPorts: outPorts};
}

function processDeferNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: DeferNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const curParent = createAndConnect(
    diagramModel,
    parent,
    'Defer',
    DeferNodeColor,
    relation,
  );
  const nodeModel = curParent.treeNode?.node;
  const outPort = nodeModel?.addOutPort('primary');
  const row = nodeModel?.createItem(SimpleTextListItemType);
  if (curParent.treeNode) {
    curParent.treeNode.rowsCount++;
  }
  row?.setOutPort(outPort);
  outPort?.setLocked(true);
  row?.setContent({
    label: node.primary.subselection,
    backgroundColor: DeferNodeColor,
  });
  const primaryPorts = node.primary.node
    ? processNode(
        diagramModel,
        {
          treeNode: curParent.treeNode,
          depth: curParent.depth,
          outPorts: outPort? [outPort] : [],
        },
        node.primary.node,
        fetchNodes,
        'primary',
      )
    : null;
  const outPorts: DefaultPortModel[] = [];
  let treeNode = primaryPorts ? primaryPorts.treeNode : curParent.treeNode;
  let maxDepth = primaryPorts ? primaryPorts.depth : curParent.depth;
  if (primaryPorts && primaryPorts.outPorts) {
    outPorts.push(...primaryPorts.outPorts);
  }

  const deferredOutPort = nodeModel?.addOutPort('deferred');
  const deferredRow = nodeModel?.createItem(SimpleTextListItemType);
  if (curParent.treeNode) {
    curParent.treeNode.rowsCount++;
  }
  deferredRow?.setOutPort(deferredOutPort);
  deferredOutPort?.setLocked(true);
  deferredRow?.setContent({
    label: 'deferred',
    backgroundColor: DeferNodeColor,
  });
  const newParent: ResultPorts = {
    treeNode: curParent.treeNode,
    depth: curParent.depth,
    outPorts: deferredOutPort ? [deferredOutPort] : [],
  };
  node.deferred.forEach((deferred) => {
    if (deferred.node) {
      const deferredPorts = processNode(
        diagramModel,
        newParent,
        deferred.node,
        fetchNodes,
        deferred.subselection,
      );
      if (deferredPorts.depth > maxDepth) {
        maxDepth = deferredPorts.depth;
        treeNode = deferredPorts.treeNode;
      }
      outPorts.push(...deferredPorts.outPorts);
      const deferredInPort = deferredPorts.treeNode?.node.getInPort();
      if (deferredInPort) {
        deferred.depends.forEach((depend) => {
          const fetchNode = fetchNodes.get(depend.id);
          if (fetchNode) {
            const fetchOutPort = fetchNode.getOutPort() as DefaultPortModel;
            const link = fetchOutPort.link<DefaultLinkModel>(deferredInPort);
            link.setWidth(2);
            link.setColor(dependingLinkColor);
            link.setLocked(true);
            if (depend.deferLabel) {
              link.addLabel(depend.deferLabel);
            }
            diagramModel.addLink(link);
          }
        });
      }
    }
  });
  return {treeNode: treeNode, depth: maxDepth, outPorts: outPorts};
}

function processFlattenNode(
  diagramModel: DiagramModel,
  parent: ResultPorts,
  node: FlattenNode,
  fetchNodes: Map<string, ListNodeModel>,
  relation?: string,
): ResultPorts {
  const curParent = createAndConnect(
    diagramModel,
    parent,
    'Flatten (' + node.path.join('.').replaceAll('@', '[]') + ')',
    FlattenNodeColor,
    relation,
  );
  return processNode(diagramModel, curParent, node.node, fetchNodes);
}

function processSubscriptionNode(
  diagramModel: DiagramModel,
  node: SubscriptionNode,
): void {
  const curParent = createAndConnect(
    diagramModel,
    {outPorts: [], depth: 0},
    'Subscription',
    SubscriptionNodeColor,
  );
  const fetchNodes = new Map<string, ListNodeModel>();
  processFetchNode(
    diagramModel,
    curParent,
    node.primary,
    fetchNodes,
    'primary',
  );
  if (node.rest) {
    processNode(diagramModel, curParent, node.rest, fetchNodes, 'rest');
  }
}

function processQueryPlan(diagramModel: DiagramModel, node: PlanNode): void {
  const nodeModel = new ListNodeModel({
    name: 'Query Plan',
    color: QueryPlanNodeColor,
  });
  diagramModel.addNode(nodeModel);
  const treeNode = createTreeNode(nodeModel);
  const parent: ResultPorts = {
    treeNode: treeNode,
    depth: 0,
    outPorts: []
  };
  const fetchNodes = new Map<string, ListNodeModel>();
  processNode(diagramModel, parent, node, fetchNodes);
  nodeModel.setPosition(10, 10);
  layout(treeNode.children, 10, 80, {
    charWidth: 7,
    rowHeight: 20,
    yGap: 20,
    xGap: 20,
    nodeWidth: 30,
  });
}

function process(diagramModel: DiagramModel, plan: QueryPlan) {
  const node = plan.node;
  if (node) {
    if (node.kind === 'Subscription') {
      processSubscriptionNode(diagramModel, node);
    } else {
      processQueryPlan(diagramModel, node);
    }
  }
}

function flattenEntitiesField(node: DocumentNode): DocumentNode {
  return visit(node, {
    OperationDefinition: ({operation, selectionSet}) => {
      const firstSelection = selectionSet.selections[0];
      if (
        operation === 'query' &&
        firstSelection.kind === Kind.FIELD &&
        firstSelection.name.value === '_entities'
      ) {
        return firstSelection.selectionSet;
      }
      // we don't want to print the `query { }` definition either for query plan printing
      return selectionSet;
    },
  });
}

const singleIndent = '  ';

function printQueryPlanSelection(indent: string, selection: QueryPlanSelectionNode): string[] {
  switch (selection.kind) {
    case 'Field':
      return printQueryPlanField(indent, selection as QueryPlanFieldNode);
    case 'InlineFragment':
      return printQueryPlanInlineFragment(indent, selection as QueryPlanInlineFragmentNode);
 }
}

function printQueryPlanField(indent: string, field: QueryPlanFieldNode): string[] {
  const result: string[] = [];
  const fieldStr = indent + field.name + (field.alias ? (' as ' + field.alias) : '');
  if (field.selections) {
    result.push(fieldStr + ' {');
    const children = printQueryPlanSelections(indent + singleIndent, field.selections);
    result.push(...children);
    result.push(indent + '}');
  } else {
    result.push(fieldStr);
  }
  return result;
}

function printQueryPlanInlineFragment(indent: string, fragment: QueryPlanInlineFragmentNode): string[] {
  const result: string[] = [];
  result.push(fragment.typeCondition? (indent + fragment.typeCondition + ' {') : '{');
  const children = printQueryPlanSelections(indent + singleIndent, fragment.selections);
  result.push(...children);
  result.push(indent + '}');
  return result;
}

function printQueryPlanSelections(indent: string, selections?: QueryPlanSelectionNode[]): string[] {
  const result: string[] = [];
  if (!selections || selections.length === 0) {
    return result;
  }
  selections.forEach(selection => {
    const children = printQueryPlanSelection(indent, selection);
    result.push(...children);
  });
  return result;
}
