let baseId = 1;
export const TYPE_TEXT = 'mona_text';

export default class VNode {
  type: string;
  container: any;
  props?: any;
  text?: string;

  parent: VNode | null = null;
  firstChild: VNode | null = null;
  lastChild: VNode | null = null;
  previousSibling: VNode | null = null;
  nextSibling: VNode | null = null;

  private _key: number;

  constructor({ type, props, container }: { type: string; container: any; props?: any }) {
    this._key = baseId++;
    this.type = type;
    this.container = container;
    this.props = props;
  }


  static toNodeJSON(node: VNode) {
    if (node.type === TYPE_TEXT) {
      return {
        key: node._key,
        type: node.type,
        text: node.text,
      };
    }

    return {
      key: node._key,
      type: node.type,
      text: node.text,
      props: node.props,
      children: [] as any
    };
  }

  appendChild(node: VNode) {
    // perf
    this.removeChild(node);
    node.parent = this;

    if (!this.firstChild) {
      this.firstChild = node;
    } else if (this.lastChild) {
      this.lastChild.nextSibling = node;
      node.previousSibling = this.lastChild;
    }
    this.lastChild = node;
  }

  removeChild(node: VNode) {
    if (node.parent !== this) {
      return;
    }
    
    const { previousSibling: prev, nextSibling: next } = this;
    if (prev && next) {
      prev.nextSibling = next;
      next.previousSibling = prev;
    } else if (prev) {
      prev.nextSibling = null;
      this.lastChild = prev;
    } else if (next) {
      next.previousSibling = null;
      this.firstChild = next;
    }

    node.previousSibling = null;
    node.nextSibling = null;
  }

  insertBefore(node: VNode, refNode: VNode) {
    this.removeChild(node);
 
    node.parent = this;
    const prev = refNode.previousSibling;
    node.nextSibling = refNode;
    refNode.previousSibling = node;
    node.previousSibling = prev;

    if (prev) {
      prev.nextSibling = node;
    } else {
      this.firstChild = node;
    }
  }

  toJSON() {
    const nodeJson = VNode.toNodeJSON(this);
    let child = this.firstChild;
    while (child) {
      nodeJson.children?.push(child.toJSON());
      child = child.nextSibling;
    }
    return nodeJson;
  }
}