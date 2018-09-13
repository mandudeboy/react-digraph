// @flow
/*
  Copyright(c) 2018 Uber Technologies, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

          http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { type IEdge } from './edge';
import { type INode } from './node';
import { isNull } from 'util';

export type INodeMapNode = {
  node: INode;
  originalArrIndex: number;
  incomingEdges: IEdge[];
  outgoingEdges: IEdge[];
  parents: INode[];
  children: INode[];
};

class GraphUtils {
  static getNodesMap(arr: INode[], key: string) {
    const map = {};
    arr.forEach((item, index) => {
      map[`key-${item[key]}`] = {
        children: [],
        incomingEdges: [],
        node: item,
        originalArrIndex: index,
        outgoingEdges: [],
        parents: []
      };
    });
    return map;
  }

  static getEdgesMap(arr: IEdge[]) {
    const map = {};
    arr.forEach((item, index) => {
      if (!item.target) {
        return;
      }
      map[`${item.source || ''}_${item.target}`] = {
        edge: item,
        originalArrIndex: index
      };
    });
    return map;
  }

  static linkNodesAndEdges(nodesMap: any, edges: IEdge[]) {
    edges.forEach((edge) => {
      if (!edge.target) {
        return;
      }
      const nodeMapSourceNode = nodesMap[`key-${edge.source || ''}`];
      const nodeMapTargetNode = nodesMap[`key-${edge.target}`];
      // avoid an orphaned edge
      if (nodeMapSourceNode && nodeMapTargetNode) {
        nodeMapSourceNode.outgoingEdges.push(edge);
        nodeMapTargetNode.incomingEdges.push(edge);
        nodeMapSourceNode.children.push(nodeMapTargetNode);
        nodeMapTargetNode.parents.push(nodeMapSourceNode);
      }
    });
  }

  static removeElementFromDom(id: string) {
    const container = document.getElementById(id);
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
      return true;
    }
    return false;
  }

  static findParent(element: any, selector: string) {
    if (element && element.matches && element.matches(selector)) {
      return element;
    } else if (element && element.parentNode) {
      return GraphUtils.findParent(element.parentNode, selector);
    }
    return null;
  }

  static classNames(...args: any[]) {
    let className = '';
    for (const arg of args) {
      if (typeof arg === 'string' || typeof arg === 'number') {
        className += ` ${arg}`;
      } else if (typeof arg === 'object' && !Array.isArray(arg) && !isNull(arg)) {
        Object.keys(arg).forEach((key) => {
          if (Boolean(arg[key])) {
            className += ` ${key}`;
          }
        });
      } else if (Array.isArray(arg)) {
        className += ` ${arg.join(' ')}`;
      }
    }

    return className.trim();
  }
}

export default GraphUtils;
