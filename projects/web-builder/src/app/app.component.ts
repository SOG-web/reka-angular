import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal
} from '@angular/core';
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
      <div class="flex-1 flex-col">
        <!--        <Preview />-->
        <pre>{{ samlpeParsedComponent() }}</pre>

        <div>
          <h1>Dynamic Component Rendering</h1>
          <ng-container #componentContainer></ng-container>
        </div>
      </div>
    </div>
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'web-builder';
  reka = signal<Reka | null>(null);

  @ViewChild('componentContainer', { read: ViewContainerRef, static: true }) componentContainer!: ViewContainerRef;

  samlpeParsedComponent  = signal<string>('')

  constructor(public ngxRekaService: NgxRekaService, private ngxRekaParserService: NgxRekaParserService, private componentFactoryResolver: ComponentFactoryResolver) {
    this.ngxRekaService.setReka(reka);
    this.ngxRekaService.reka$.subscribe({
      next: val => {
        if(val) {
          this.reka.set(val);
        }
      }
    })
    this.samlpeParsedComponent.set(this.ngxRekaParserService.parseComponent(sampleAst.components[0]))
    if(this.samlpeParsedComponent() !== '') {
      // @ts-ignore
      // const factory = this.componentFactoryResolver.resolveComponentFactory(this.samlpeParsedComponent());
      // this.componentContainer.createComponent(factory);
    }
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
