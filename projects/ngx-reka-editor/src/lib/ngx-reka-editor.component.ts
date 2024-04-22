import {AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {EditorState, Extension} from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {reka as rekaCodemirrorExtension} from '@rekajs/codemirror';
import {basicSetup} from 'codemirror';
import {NgxRekaEditorService} from "./ngx-reka-editor.service";
import {debounceTime, Subject, Subscription, takeUntil} from 'rxjs';
import {onStatusChangeCb, ParserStatus} from "./utils";
import * as t from '@rekajs/types';
import {Parser} from "@rekajs/parser";
import {Reka} from "@rekajs/core";
import {error} from "ng-packagr/lib/utils/log";

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
export class NgxRekaEditorComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('editorRef', { static: true }) editorRef!: ElementRef;
  @Input() extensions: Extension[] = [];
  @Input({required: true})  reka!: Reka;

  private codemirrorView: EditorView | null = null;
  private codeChangeSubject = new Subject<string>();
  private statusChangeSubject = new Subject<ParserStatus>();
  private currentSate = signal<any | null>(null);
  private isSynchingFromCodeMirror = signal(false);
  private isSynchingFromExternal = signal(false);
  private isTyping = signal(false);
  private currentCodeString = signal<any | null>(null);
//
  public getOnStatusChange(callback: onStatusChangeCb): Subscription {
    return this.statusChangeSubject.asObservable().subscribe(callback);
  }

  private destroy$ = new Subject<void>();
  private unsubscribe$: any;

  constructor(private rekaEitordService: NgxRekaEditorService) {}

  ngOnInit() {
    const editorDom = this.editorRef.nativeElement;
    this.currentCodeString.set(Parser.stringify(this.reka.program));
    this.currentSate.set(t.Schema.fromJSON(this.reka.program));
    this.codemirrorView = new EditorView({
      state: EditorState.create({
        doc: this.currentCodeString(),
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
          EditorView.updateListener.of((view) => {
            if (!view.docChanged || this.isSynchingFromCodeMirror()) {
              return;
            }

            this.isTyping.set(true);
            this.currentCodeString.set(view.state.doc.toString());
            this.onStatusChange({type: 'parsing'})
            this.codeChangeSubject.next(this.currentCodeString());
          }),
        ],
      }),
      parent: editorDom,
    });

    this.codeChangeSubject.pipe(
      debounceTime(1000),
      takeUntil(this.destroy$)
    ).subscribe({
      next: code => this.handleCodeChange(code),
      error: error => this.onStatusChange({ type: 'error', error: error.message })
    });
  }

  private handleCodeChange(code: string) {

    if(this.isSynchingFromExternal()) {
      return;
    }
    this.isSynchingFromCodeMirror.set(true);
    if (this.reka.program) {
      this.onStatusChange({ type: 'parsing' })
      try {
        const newAST = this.rekaEitordService.parseProgram(code);
        this.reka.change(() => {
          this.rekaEitordService.diffAST(this.currentSate(), newAST);
          this.rekaEitordService.diffAST(this.reka.program, this.currentSate());
        });
        this.onStatusChange({ type: 'success' });
      } catch (error) {
        // @ts-ignore
        this.onStatusChange({ type: 'error', error: error.message });
      }
    } else {
      this.onStatusChange({ type: 'error', error: 'Reka -> Program is not available' });
    }
    this.isSynchingFromCodeMirror.set(false);
    this.isTyping.set(false);
  }

  private onStatusChange(status: ParserStatus) {
    this.statusChangeSubject.next(status);
  }

  public onExternalChange() {

    if(this.isSynchingFromCodeMirror() || this.isTyping()) {
      return
    }

    if(this.isSynchingFromExternal()) {
      return;
    }

    try {
      if(!this.codemirrorView) {
        return;
      }

      const newCode = this.rekaEitordService.stringifyProgram( this.reka.program);

      if(newCode === this.currentCodeString()) {
        this.isSynchingFromExternal.set(false)
        return;
      }

      this.currentSate.set(t.Schema.fromJSON(this.reka.program))

      const transaction = this.codemirrorView.state.update({
        changes: {
          from: 0,
          to: this.codemirrorView.state.doc.length,
          insert: newCode,
        },
      });

      this.currentCodeString.set(newCode);
      this.codemirrorView.dispatch(transaction);
      this.isSynchingFromExternal.set(false);

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

    if(this.unsubscribe$) {
      this.unsubscribe$()
    }
  }

  ngAfterViewInit(): void {
    this.unsubscribe$ = this.reka.listenToChangeset(() => {
      this.onExternalChange();
    })
  }
}
