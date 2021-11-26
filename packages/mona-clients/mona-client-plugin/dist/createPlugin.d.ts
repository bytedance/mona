import React from 'react';
export interface PageProps {
    search: string;
    searchParams: Record<string, string>;
}
export declare function createPlugin(Component: React.ComponentType<any>, routes: {
    path: string;
    title: string;
    component: React.ComponentType<any>;
}[]): {
    provider: () => {
        render: ({ dom }: {
            dom: Element | Document;
        }) => void;
        destroy({ dom }: {
            dom: Element;
        }): void;
    };
};
