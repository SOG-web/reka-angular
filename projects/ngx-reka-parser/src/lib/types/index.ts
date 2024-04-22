// Reka AST Node Types
export type ValNode = {
  name: string;
  init: LiteralNode;
};

export type LiteralNode = {
  value: any;
};

export type TagTemplateNode = {
  tag: string;
  props: { [key: string]: any };
  children: Array<TagTemplateNode | TextTemplateNode>;
};

export type TextTemplateNode = {
  tag: 'text';
  props: { value: string };
  children: [];
};

export type RekaComponentNode = {
  name: string;
  state: ValNode[];
  props: any[];
  template: TagTemplateNode;
};

export type ProgramNode = {
  components: RekaComponentNode[];
};

// Example Reka AST
export const sampleAst: ProgramNode = {
  components: [
    {
      name: 'App',
      state: [{ name: 'counter', init: { value: 0 } }],
      props: [],
      template: {
        tag: 'div',
        props: [],
        children: [
          {
            tag: 'text',
            props: { value: 'Hello!' },
            children: [],
          },
        ],
      },
    },
  ],
};
