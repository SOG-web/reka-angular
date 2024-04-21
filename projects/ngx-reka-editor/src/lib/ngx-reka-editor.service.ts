import { Injectable } from '@angular/core';
import * as t from "@rekajs/types";
import {Parser} from "@rekajs/parser";
import {_diffASTArrayTypes} from "./utils";

@Injectable({
  providedIn: 'root'
})
export class NgxRekaEditorService {

  parseProgram(code: string): t.Program {
    return Parser.parseProgram(code);
  }

  stringifyProgram(program: t.Program): string {
    return Parser.stringify(program);
  }

  diffAST(program: t.Program, newProgram: t.Program) {
    // Diff Globals
    _diffASTArrayTypes(
      program,
      newProgram,
      (program) => program.globals,
      (a, b) => a.name === b.name
    );

    // Diff components
    _diffASTArrayTypes(
      program,
      newProgram,
      (program) => program.components,
      (a, b) => a.name === b.name
    );
  }
}
