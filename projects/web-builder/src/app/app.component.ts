import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as t from '@rekajs/types';
import { Reka } from '@rekajs/core';


import {inistialRekaComponents} from "./reka";
import {NgxRekaEditorComponent} from "../../../ngx-reka-editor/src/lib/ngx-reka-editor.component";
import {NgxRekaService} from "../../../ngx-reka/src/lib/ngx-reka.service";
import {NgxRekaParserService} from "../../../ngx-reka-parser/src/lib/ngx-reka-parser.service";
import {sampleAst} from "../../../ngx-reka-parser/src/lib/types";

const reka = Reka.create();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxRekaEditorComponent],
  providers: [NgxRekaParserService],
  template: `
    <div class="flex h-screen">
      <div class="w-3/6 h-full border-r-2">
        <div class="w-full h-full p-4">
          <ngx-reka-editor class="w-full h-full text-sm" [reka]="reka()!"/>
        </div>
      </div>
      <div class="flex-1">
        <!--        <Preview />-->
        {{ samlpeParsedComponent() }}
      </div>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web-builder';
  reka = signal<Reka | null>(null);

  samlpeParsedComponent  = signal<string>('')

  constructor(public ngxRekaService: NgxRekaService, private ngxRekaParserService: NgxRekaParserService) {
    this.ngxRekaService.setReka(reka);
    this.ngxRekaService.reka$.subscribe({
      next: val => {
        if(val) {
          this.reka.set(val);
        }
      }
    })
    sampleAst.components.forEach(component => {
      this.samlpeParsedComponent.update( (old) =>
        `${old}\n
        ${this.ngxRekaParserService.parseComponent(component)}
        `
      );
    })
  }

  ngOnInit(): void {
    inistialRekaComponents(reka);
    reka.createFrame({
      id: 'Main app',
      component: {
        name: 'App',
      },
    });
    reka.createFrame({
      id: 'Primary button',
      component: {
        name: 'Button',
        props: {
          text: t.literal({ value: 'Primary button' }),
        },
      },
    });
  }


}
