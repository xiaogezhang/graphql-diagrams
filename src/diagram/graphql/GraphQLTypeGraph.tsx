import {
  GraphQLEnumType,
  GraphQLError,
  GraphQLInputObjectType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLUnionType,
  isEnumType,
  isInputObjectType,
  isInterfaceType,
  isObjectType,
  isScalarType,
  isUnionType,
} from 'graphql';
import {
  DiagramModel,
  DefaultLinkModel,
  DefaultPortModel,
} from '@projectstorm/react-diagrams';

import tinycolor from 'tinycolor2';
import {ListNodeModel} from '../node/ListNodeModel';
import {SimpleTextListItemType} from '../list/SimpleTextListItem';
import {
  LeftAndRight,
  LeftAndRightListItemType,
} from '../list/LeftAndRightListItem';
import {typeDisplayName} from './GraphQLTypeUtils';
import {TargetType} from '../list/ClickableText';
import {TypeGraphOptions} from './GraphQLDiagramContext';
import {TreeNode, layout} from '../layout';
import { MultiLineText, MultiLineTextListItemType } from '../list/MultiLineTextListItem';

const ErrorNodeColor: string = 'Crimson';
const TypeNodeColor: string = 'rgb(248, 248, 235)';
const InterfaceNodeColor: string = 'rgb(255, 250, 180)';
const InputObjectTypeColor: string = tinycolor('LightCyan')
  .lighten(15)
  .toRgbString();
const UnionTypeColor: string = tinycolor('SlateGrey').lighten(20).toRgbString();
const EnumColor: string = tinycolor('MediumOrchid').lighten(30).toRgbString();
const MutationColor: string = tinycolor('Brown').lighten(50).toRgbString();
const QueryColor: string = tinycolor('LightGreen').lighten(15).toRgbString();

const fieldTypeLinkColor = 'PeachPuff';
const implementationLinkColor = 'ForestGreen';
const schemaMetaLinkColor = 'CadetBlue';
const metaTypeLinkColor = 'Turquoise';
const unionTypeLinkColor = 'SpringGreen';

const EnumValuesLimit = 20;

function createTypeNode(
  diagramModel: DiagramModel,
  type:
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLInputObjectType
    | GraphQLUnionType
    | GraphQLEnumType,
  nodeColor: string,
  nodesMap: Map<string, ListNodeModel>,
): TreeNode | null {
  let objectNode = nodesMap.get(type.name);
  if (objectNode) {
    return null;
  }

  const typeNode = new ListNodeModel({
    name: type.name,
    color: nodeColor,
  });
  diagramModel.addNode(typeNode);
  nodesMap.set(type.name, typeNode);
  const inPort = typeNode.addInPort('class in ' + type.name);
  typeNode.setInPort(inPort);
  inPort.setLocked(true);
  const outPort = typeNode.addOutPort('class out ' + type.name);
  typeNode.setOutPort(outPort);
  outPort.setLocked(true);
  const typeTreeNode: TreeNode = {
    node: typeNode,
    rowsCount: 0,
    width: type.name.length,
    children: [],
  };

  hydrateTypeNode(diagramModel, type, typeTreeNode, nodesMap);
  return typeTreeNode;
}

function hydrateUnionType(
  diagramModel: DiagramModel,
  type: GraphQLUnionType,
  typeTreeNode: TreeNode,
  nodesMap: Map<string, ListNodeModel>,
): void {
  const types = type.getTypes();
  const typeNode = typeTreeNode.node;
  types.forEach((member) => {
    const memberName = member.name;
    const memberRow = typeNode.createItem(SimpleTextListItemType);
    const memberRowPort = typeNode.addOutPort(memberName);
    memberRow.setOutPort(memberRowPort);
    memberRowPort.setLocked(true);
    typeTreeNode.rowsCount++;
    const memberTreeNode = createTypeNode(
      diagramModel,
      member,
      TypeNodeColor,
      nodesMap,
    );
    let memberNode;
    if (memberTreeNode) {
      typeTreeNode.children.push(memberTreeNode);
      if (memberName.length > typeTreeNode.width) {
        typeTreeNode.width = memberName.length;
      }
      memberNode = memberTreeNode.node;
    } else {
      memberNode = nodesMap.get(memberName);
    }
    const memberInPort = memberNode.getInPort();
    const memberLink = memberRowPort.link<DefaultLinkModel>(memberInPort);
    memberLink.setWidth(2);
    memberLink.setColor(unionTypeLinkColor);
    memberLink.setLocked(true);
    diagramModel.addLink(memberLink);
    memberRow.setContent({
      label: memberName,
      backgroundColor: typeNode.getOptions().color,
      target: {
        type: TargetType.NODE,
        value: memberNode.getID(),
      },
    });
  });
}

function hydrateEnumType(
  diagramModel: DiagramModel,
  type: GraphQLEnumType,
  typeTreeNode: TreeNode,
  nodesMap: Map<string, ListNodeModel>,
): void {
  const values = type.getValues();
  const typeNode = typeTreeNode.node;
  if (values.length <= EnumValuesLimit) {
    values.forEach((value) => {
      const valueRow = typeNode.createItem(SimpleTextListItemType);
      typeTreeNode.rowsCount++;
      valueRow.setContent({
        label: value.name,
        backgroundColor: typeNode.getOptions().color,
      });
    });
  } else {
    const valueRow = typeNode.createItem(SimpleTextListItemType);
    typeTreeNode.rowsCount++;
    valueRow.setContent({
      label: '... Too many values, skipped.',
      backgroundColor: typeNode.getOptions().color,
    });
    typeNode.width = 40;
  }
}

function hydrateTypeNode(
  diagramModel: DiagramModel,
  type:
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLInputObjectType
    | GraphQLUnionType
    | GraphQLEnumType,
  typeTreeNode: TreeNode,
  nodesMap: Map<string, ListNodeModel>,
): void {
  if (isUnionType(type)) {
    hydrateUnionType(diagramModel, type, typeTreeNode, nodesMap);
    return;
  }
  if (isEnumType(type)) {
    hydrateEnumType(diagramModel, type, typeTreeNode, nodesMap);
    return;
  }
  const fields = Object.values(type.getFields());
  const typeNode = typeTreeNode.node;
  const isMutation = typeTreeNode.node.getOptions().name === 'Mutation';
  const isQuery = typeTreeNode.node.getOptions().name === 'Query';

  fields.map((field) => {
    const fieldName = field.name;
    const fieldType = field.type;
    const fieldTypeDisplay = typeDisplayName(fieldType);
    const displayName =
      fieldTypeDisplay.left +
      fieldTypeDisplay.baseType.name +
      fieldTypeDisplay.right;
    const fieldRow = typeNode.createItem(LeftAndRightListItemType);
    const rowContent: LeftAndRight = {
      left: {
        label: fieldName,
        backgroundColor: typeNode.getOptions().color,
      },
      right: {
        label: displayName,
        backgroundColor: typeNode.getOptions().color,
      },
    };
    typeTreeNode.rowsCount++;
    if (
      isObjectType(fieldTypeDisplay.baseType) ||
      isInputObjectType(fieldTypeDisplay.baseType) ||
      isInterfaceType(fieldTypeDisplay.baseType) ||
      isUnionType(fieldTypeDisplay.baseType)
    ) {
      const fieldTypeTreeNode = createTypeNode(
        diagramModel,
        fieldTypeDisplay.baseType,
        TypeNodeColor,
        nodesMap,
      );
      let fieldTypeNode;
      if (fieldTypeTreeNode) {
        typeTreeNode.children.push(fieldTypeTreeNode);
        fieldTypeNode = fieldTypeTreeNode.node;
      } else {
        fieldTypeNode = nodesMap.get(fieldTypeDisplay.baseType.name);
      }
      if (isMutation) {
        fieldTypeNode.getOptions().color = MutationColor;
      } else if (isQuery) {
        fieldTypeNode.getOptions().color = QueryColor;
      }
      if (rowContent.right) {
        rowContent.right.target = {
          type: TargetType.NODE,
          value: fieldTypeNode.getID(),
        };
      }
      const rowOutPort = typeNode.addOutPort(fieldName);
      fieldRow.setOutPort(rowOutPort);
      rowOutPort.setLocked(true);
      const fieldTypeInPort = fieldTypeNode.getInPort();
      const fieldLink = rowOutPort.link<DefaultLinkModel>(fieldTypeInPort);
      fieldLink.setWidth(2);
      fieldLink.setColor(fieldTypeLinkColor);
      fieldLink.setLocked(true);
      diagramModel.addLink(fieldLink);
    }
    const fieldLen = fieldName.length + displayName.length + 4;
    if (fieldLen > typeTreeNode.width) {
      typeTreeNode.width = fieldLen;
    }
    fieldRow.setContent(rowContent);
  });
}

const startX: number = 20;
const startY: number = 20;
const charWidth: number = 7;

function addImplementsLinks(
  schema: GraphQLSchema,
  nodesMap: Map<string, ListNodeModel>,
  diagramModel: DiagramModel,
): void {
  for (let key in nodesMap.keys()) {
    const node = nodesMap.get(key);
    const type = schema.getType(key);
    if (node && (isObjectType(type) || isInterfaceType(type))) {
      const interfaces = type.getInterfaces();
      const inPort = node.getInPort();
      if (inPort) {
        interfaces.forEach((inter) => {
          const interfaceNode = nodesMap.get(inter.name);
          if (interfaceNode) {
            const outPort = interfaceNode.getOutPort() as DefaultPortModel;
            const implementationLink = outPort.link<DefaultLinkModel>(inPort);
            implementationLink.setWidth(2);
            implementationLink.setColor(implementationLinkColor);
            implementationLink.setLocked(true);
            diagramModel.addLink(implementationLink);
          }
        });
      }
    }
  }
}

/**
 * Take a GraphQL schema as input, create a diagram model for the UI. 
 * 
 * There's one schema node, which has links to meta nodes, such as "Object Types", "Interfaces" etc
 * 
 * Each meta node has links (may not show to make canvas cleaner) to corresponding GraphQL elements. 
 * In each node, there may be fields or other types, and may contain links to them. The links are navigable.
 * 
 * @param errors errors when creating this schema. It may be syntax error, parse error, validation error etc. 
 * @param schema schema passed in. It may be undefined if there's error
 * @param options 
 * @returns 
 */
export function createTypeGraph(
  errors: ReadonlyArray<GraphQLError>,
  schema?: GraphQLSchema,
  options?: TypeGraphOptions,
): DiagramModel {
  const diagramModel = new DiagramModel();

  const roots: Array<TreeNode> = [];

  if (errors.length > 0) {
    const errorsNode = new ListNodeModel({
      name: 'Errors',
      color: ErrorNodeColor,
    });
    diagramModel.addNode(errorsNode);
    let width = 6;
    errors.forEach((error, idx) => {
      const errorStr = error.toString();
      const lines = errorStr.split(/\r?\n/);
      const content: MultiLineText = {
        content: lines,
        backgroundColor: ErrorNodeColor,
        initNumberOfRows: 10,
      };
      for (let i = 0; i < 15 && i < lines.length; i++) {
        if (width < lines[i].length) {
          width = lines[i].length;
        }
      }

      const row = errorsNode.createItem(
        MultiLineTextListItemType,
      );
      row.setContent(content);
    });
    roots.push({
      node: errorsNode,
      rowsCount: errors.length,
      width: width,
      children: [],
    });
  }

  if (!schema) {
    layout(roots, startX, startY);
    return diagramModel;
  }
  const schemaConfig = schema.toConfig();

  const createMetaLinks = options?.createMetaLinks ?? false;
  const createInheritanceLinks = options?.createInheritanceLinks ?? false;
  const createInputObjectTypes = options?.createInputObjectTypes ?? false;

  const nodesMap = new Map<string, ListNodeModel>();

  const schemaNode = new ListNodeModel({
    name: 'Schema',
    color: 'Azure',
  });
  schemaNode.width = 18 * charWidth;
  diagramModel.addNode(schemaNode);
  const schemaOutTargetNodes: Array<ListNodeModel> = [];
  const schemaRows: Array<{name: string; color: string}> = [
    {name: 'Scalar Types', color: 'Cyan'},
    {name: 'Directives', color: 'GoldenRod'},
    {name: 'Object Types', color: 'Beige'},
    {name: 'Query', color: 'LightGreen'},
    {name: 'Mutation', color: 'Plum'},
    {name: 'Enums', color: 'Pink'},
    {name: 'Input Object Types', color: 'LightCyan'},
    {name: 'Union Types', color: 'SlateGrey'},
    {name: 'Interfaces', color: 'LightGoldenRodYellow'},
    {name: 'Subscriptions', color: 'PaleGreen'},
  ];
  const schemaTreeNode: TreeNode = {
    node: schemaNode,
    rowsCount: schemaRows.length,
    width: 18,
    children: [],
  };
  roots.push(schemaTreeNode);
  schemaRows.forEach((schemaRow, index) => {
    const {name, color} = schemaRow;
    const nodeForRow = new ListNodeModel({
      name: name,
      color: color,
    });
    diagramModel.addNode(nodeForRow);
    const inPort = nodeForRow.addInPort('Schema');
    nodeForRow.setInPort(inPort);
    inPort.setLocked(true);
    const outPort = schemaNode.addOutPort(name);
    const row = schemaNode.createItem(SimpleTextListItemType);
    row.setOutPort(outPort);
    outPort.setLocked(true);
    row.setContent({
      label: name,
      backgroundColor: schemaNode.getOptions().color,
      target: {type: 'node', value: nodeForRow.getID()},
    });
    schemaOutTargetNodes.push(nodeForRow);
    const linkFromSchema = outPort.link<DefaultLinkModel>(inPort);
    linkFromSchema.setWidth(2);
    linkFromSchema.setColor(schemaMetaLinkColor);
    linkFromSchema.setLocked(true);
    diagramModel.addLink(linkFromSchema);
    if (name.length > schemaTreeNode.width) {
      schemaTreeNode.width = name.length;
    }
  });
  const scalarTypesNode = schemaOutTargetNodes[0];
  const directivesNode = schemaOutTargetNodes[1];
  const objectTypesNode = schemaOutTargetNodes[2];
  const queryNode = schemaOutTargetNodes[3];
  const mutationNode = schemaOutTargetNodes[4];
  const enumsNode = schemaOutTargetNodes[5];
  const inputObjectTypesNode = schemaOutTargetNodes[6];
  const unionTypesNode = schemaOutTargetNodes[7];
  const interfacesNode = schemaOutTargetNodes[8];
  const subscriptionsNode = schemaOutTargetNodes[9];

  const directives = schemaConfig.directives;
  directives.forEach((directive) => {
    const directiveRow = directivesNode.createItem(SimpleTextListItemType);
    directiveRow.setContent({
      label:
        '@' + directive.name + (directive.isRepeatable ? ' repeatable ' : ''),
      backgroundColor: directivesNode.getOptions().color,
    });
  });
  const scalarTypesTreeNode: TreeNode = {
    node: scalarTypesNode,
    rowsCount: 0,
    width: schemaRows[0].name.length,
    children: [],
  };
  schemaTreeNode.children.push(scalarTypesTreeNode);
  const directivesTreeNode: TreeNode = {
    node: directivesNode,
    rowsCount: directives.length,
    width: schemaRows[1].name.length,
    children: [],
  };
  schemaTreeNode.children.push(directivesTreeNode);
  const objectTypesTreeNode: TreeNode = {
    node: objectTypesNode,
    rowsCount: 0,
    width: schemaRows[2].name.length,
    children: [],
  };
  schemaTreeNode.children.push(objectTypesTreeNode);
  const queryTreeNode: TreeNode = {
    node: queryNode,
    rowsCount: 0,
    width: schemaRows[3].name.length,
    children: [],
  };
  schemaTreeNode.children.push(queryTreeNode);
  const mutationTreeNode: TreeNode = {
    node: mutationNode,
    rowsCount: 0,
    width: schemaRows[4].name.length,
    children: [],
  };
  schemaTreeNode.children.push(mutationTreeNode);
  const enumsTreeNode: TreeNode = {
    node: enumsNode,
    rowsCount: 0,
    width: schemaRows[5].name.length,
    children: [],
  };
  schemaTreeNode.children.push(enumsTreeNode);
  const inputObjectTypesTreeNode: TreeNode = {
    node: inputObjectTypesNode,
    rowsCount: 0,
    width: schemaRows[6].name.length,
    children: [],
  };
  schemaTreeNode.children.push(inputObjectTypesTreeNode);
  const unionTypesTreeNode: TreeNode = {
    node: unionTypesNode,
    rowsCount: 0,
    width: schemaRows[7].name.length,
    children: [],
  };
  schemaTreeNode.children.push(unionTypesTreeNode);
  const interfacesTreeNode: TreeNode = {
    node: interfacesNode,
    rowsCount: 0,
    width: schemaRows[8].name.length,
    children: [],
  };
  schemaTreeNode.children.push(interfacesTreeNode);
  const subscriptionsTreeNode: TreeNode = {
    node: subscriptionsNode,
    rowsCount: 0,
    width: schemaRows[9].name.length,
    children: [],
  };
  schemaTreeNode.children.push(subscriptionsTreeNode);

  const types = schemaConfig.types;
  const queryType = schemaConfig.query;
  const mutationType = schemaConfig.mutation;
  const subscriptionType = schemaConfig.subscription;

  types.forEach((type) => {
    if (
      !type.name.startsWith('__') &&
      type.name !== queryType?.name &&
      type.name !== mutationType?.name &&
      type.name !== subscriptionType?.name
    ) {
      if (isScalarType(type)) {
        const scalarTypeRow = scalarTypesNode.createItem(
          SimpleTextListItemType,
        );
        scalarTypeRow.setContent({
          label: type.name,
          backgroundColor: scalarTypesNode.getOptions().color,
        });
        scalarTypesTreeNode.rowsCount++;
      } else if (isObjectType(type)) {
        createTypeRowAndNode(
          diagramModel,
          objectTypesTreeNode,
          type,
          nodesMap,
          TypeNodeColor,
          createMetaLinks,
        );
      } else if (isEnumType(type)) {
        createTypeRowAndNode(
          diagramModel,
          enumsTreeNode,
          type,
          nodesMap,
          EnumColor,
          createMetaLinks,
        );
      } else if (isInputObjectType(type)) {
        createTypeRowAndNode(
          diagramModel,
          inputObjectTypesTreeNode,
          type,
          nodesMap,
          InputObjectTypeColor,
          createMetaLinks,
        );
      } else if (isUnionType(type)) {
        createTypeRowAndNode(
          diagramModel,
          unionTypesTreeNode,
          type,
          nodesMap,
          UnionTypeColor,
          createMetaLinks,
        );
      } else if (isInterfaceType(type)) {
        createTypeRowAndNode(
          diagramModel,
          interfacesTreeNode,
          type,
          nodesMap,
          InterfaceNodeColor,
          createMetaLinks,
        );
      }
    }
  });
  if (queryType) {
    hydrateTypeNode(diagramModel, queryType, queryTreeNode, nodesMap);
  }
  if (mutationType) {
    hydrateTypeNode(diagramModel, mutationType, mutationTreeNode, nodesMap);
  }

  if (subscriptionType) {
    hydrateTypeNode(
      diagramModel,
      subscriptionType,
      subscriptionsTreeNode,
      nodesMap,
    );
  }
  if (createInheritanceLinks) {
    addImplementsLinks(schema, nodesMap, diagramModel);
  }

  layout(roots, startX, startY);

  return diagramModel;
}

function createTypeRowAndNode(
  diagramModel: DiagramModel,
  typesTreeNode: TreeNode,
  type:
    | GraphQLObjectType
    | GraphQLInterfaceType
    | GraphQLInputObjectType
    | GraphQLUnionType
    | GraphQLEnumType,
  nodesMap: Map<string, ListNodeModel>,
  typeNodeColor: string,
  createMetaLinks: boolean,
): void {
  const typesNode = typesTreeNode.node;
  const typeRow = typesNode.createItem(SimpleTextListItemType);
  const typeRowPort = typesNode.addOutPort(type.name);
  typeRow.setOutPort(typeRowPort);
  typeRowPort.setLocked(true);
  typesTreeNode.rowsCount++;
  const typeTreeNode = createTypeNode(
    diagramModel,
    type,
    typeNodeColor,
    nodesMap,
  );
  let typeNode;
  if (typeTreeNode) {
    typesTreeNode.children.push(typeTreeNode);
    if (type.name.length > typesTreeNode.width) {
      typesTreeNode.width = type.name.length;
    }
    typeNode = typeTreeNode.node;
  } else {
    typeNode = nodesMap.get(type.name);
  }
  const typeInPort = typeNode.getInPort();
  if (createMetaLinks) {
    const typeLink = typeRowPort.link<DefaultLinkModel>(typeInPort);
    typeLink.setWidth(2);
    typeLink.setColor(metaTypeLinkColor);
    typeLink.setLocked(true);
    diagramModel.addLink(typeLink);
  }
  typeRow.setContent({
    label: type.name,
    backgroundColor: typesNode.getOptions().color,
    target: {
      type: TargetType.NODE,
      value: typeNode.getID(),
    },
  });
}
