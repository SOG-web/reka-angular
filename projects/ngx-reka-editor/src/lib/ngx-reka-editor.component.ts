import {Component, ElementRef, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import { EditorState, Extension } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { reka as rekaCodemirrorExtension } from '@rekajs/codemirror';
import { basicSetup } from 'codemirror';
import {NgxRekaEditorService} from "./ngx-reka-editor.service";
import {Subject, Subscription, takeUntil} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {onStatusChangeCb, ParserStatus} from "./utils";
import { NgxRekaService } from 'ngx-reka';
import * as t from '@rekajs/types';
import {Parser} from "@rekajs/parser";
import {Reka} from "@rekajs/core";

@Component({
  selector: 'ngx-reka-editor',
  standalone: true,
  imports: [],
  template: `
    <div #editorRef class="reka-angular-code-editor">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .reka-angular-code-editor {
      height: 100%;
    }
  `]
})
export class NgxRekaEditorComponent implements OnInit, OnDestroy {
  @ViewChild('editorRef', { static: true }) editorRef!: ElementRef;
  @Input() extensions: Extension[] = [];
  @Input({required: true})  reka!: Reka;

  private codemirrorView: EditorView | null = null;
  private codeChangeSubject = new Subject<string>();
  private statusChangeSubject = new Subject<ParserStatus>();

  public getOnStatusChange(callback: onStatusChangeCb): Subscription {
    return this.statusChangeSubject.asObservable().subscribe(callback);
  }

  private destroy$ = new Subject<void>();

  constructor(private rekaEitordService: NgxRekaEditorService) {}

  ngOnInit() {
    const editorDom = this.editorRef.nativeElement;

    const view = new EditorView({
      state: EditorState.create({
        doc: Parser.stringify(this.reka.program),
        extensions: [
          basicSetup,
          keymap.of([]), // Add your keymaps if needed
          rekaCodemirrorExtension(),
          ...this.extensions,
          EditorView.theme({
            '&': {
              height: '100%',
            },
            '.cm-scroller': {
              'font-family': 'inherit',
              fontSize: '0.875em',
              lineHeight: '1.6em',
              wordBreak: 'break-word',
              '-webkit-font-smoothing': 'initial',
            },
            '.cm-gutters': {
              backgroundColor: '#fff',
              color: 'rgba(0,0,0,0.4)',
            },
          }),
        ],
      }),
      parent: editorDom,
    });

    this.codemirrorView = view;

    this.codeChangeSubject.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: code => this.handleCodeChange(code),
      error: error => this.onStatusChange({ type: 'error', error: error.message })
  });

    // Listen to changes in the editor
    view.dom.addEventListener('keydown', () => {
      const code = view.state.doc.toString();
      this.codeChangeSubject.next(code);
    });
  }

  private handleCodeChange(code: string) {
    try {
      this.handleProgramChange(code, this.reka.program)
    } catch (error) {
      // @ts-ignore
      this.onStatusChange({ type: 'error', error: error.message });
    }
  }

  private handleProgramChange(code: string, program: t.Program | null) {
    if (program) {
      this.onStatusChange({ type: 'parsing' })
      try {
        const newAST = this.rekaEitordService.parseProgram(code);
        // if (JSON.stringify(newAST) !== JSON.stringify(program)) {
          this.rekaEitordService.diffAST(program, newAST);
          this.onStatusChange({ type: 'success' });
        // }
      } catch (error) {
        // @ts-ignore
        this.onStatusChange({ type: 'error', error: error.message });
      }
    } else {
      this.onStatusChange({ type: 'error', error: 'Reka -> Program is not available' });
    }
  }

  private onStatusChange(status: ParserStatus) {
    this.statusChangeSubject.next(status);
  }

  public onExternalChange() {
    try {
      if (this.codemirrorView) {
        const newCode = this.rekaEitordService.stringifyProgram( this.reka.program);
        // const currentCode = this.codemirrorView.state.doc.toString();

        // if (newCode !== currentCode) {
        const transaction = this.codemirrorView.state.update({
          changes: {
            from: 0,
            to: this.codemirrorView.state.doc.length,
            insert: newCode,
          },
        });
        this.codemirrorView.dispatch(transaction);
        // }
      }
    } catch (error) {
      // @ts-ignore
      this.onStatusChange({type: 'error', error: error.message})
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.codemirrorView) {
      this.codemirrorView.destroy();
    }
  }
}
