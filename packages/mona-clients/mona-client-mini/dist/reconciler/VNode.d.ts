export declare const TYPE_TEXT = "mona_text";
export default class VNode {
    type: string;
    container: any;
    props?: any;
    text?: string;
    parent: VNode | null;
    firstChild: VNode | null;
    lastChild: VNode | null;
    previousSibling: VNode | null;
    nextSibling: VNode | null;
    private _key;
    constructor({ type, props, container }: {
        type: string;
        container: any;
        props?: any;
    });
    static toNodeJSON(node: VNode): {
        key: number;
        type: string;
        text: string | undefined;
        props?: undefined;
        children?: undefined;
    } | {
        key: number;
        type: string;
        text: string | undefined;
        props: any;
        children: any;
    };
    appendChild(node: VNode): void;
    removeChild(node: VNode): void;
    insertBefore(node: VNode, refNode: VNode): void;
    toJSON(): {
        key: number;
        type: string;
        text: string | undefined;
        props?: undefined;
        children?: undefined;
    } | {
        key: number;
        type: string;
        text: string | undefined;
        props: any;
        children: any;
    };
}
