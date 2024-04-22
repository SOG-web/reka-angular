import { Injectable } from '@angular/core';
import * as ngT from './types';

@Injectable({
  providedIn: 'root'
})
export class NgxRekaParserService {

  constructor() { }

  parseComponent(component: ngT.RekaComponentNode): string {
    const template = this.parseTemplate(component.template);
    const state = this.parseState(component.state);
    const props = this.parseProps(component.props);

    return `
      import { Component } from '@angular/core';

      @Component({
        selector: '${component.name.toLowerCase()}', // Use lowercase for selector
        template: \`
          ${template}
        \`,
      })
      export class ${component.name}Component {
        ${state}
        ${props}
      }
    `;
  }

  private parseTemplate(template: ngT.TagTemplateNode | ngT.TextTemplateNode): string {
    if (template.tag === 'text') {
      return `{{ '${template.props.value}' }}`;
    }

    const children = template.children.map(child => this.parseTemplate(child)).join('\n');
    // @ts-ignore
    const props = this.parseProps(template.props);

    return `
      <${template.tag} ${props}>
        ${children}
      </${template.tag}>
    `;
  }

  private parseState(state: ngT.ValNode[]): string {
    return state.map(val => `  ${val.name} = ${val.init.value};`).join('\n');
  }

  private parseProps(props: any[]): string {
    if (props.length === 0) {
      return '';
    }

    return `@Input() ${props.join(', @Input() ')}`;
  }
}
