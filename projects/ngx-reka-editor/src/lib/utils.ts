import * as t from '@rekajs/types';

export const _diffASTArrayTypes = <T extends t.Type>(
  program: t.Program,
  newProgram: t.Program,
  getTarget: (program: t.Program) => T[],
  isEqual: (a: T, b: T) => boolean
) => {
  const currentComponents = getTarget(program);
  const newComponents = getTarget(newProgram);

  const componentsToInsert: [T, number][] = [];

  newComponents.forEach((newComponent, i) => {
    const existingComponent = currentComponents.find((oldComponent) =>
      isEqual(oldComponent, newComponent)
    );

    if (!existingComponent) {
      componentsToInsert.push([newComponent, i]);
      return;
    }

    t.merge(existingComponent, newComponent);
  });

  componentsToInsert.forEach(([component, index], i) => {
    currentComponents.splice(index + i, 0, component);
  });

  currentComponents
    .filter(
      (oldComponent) =>
        !newComponents.find((newComponent) =>
          isEqual(oldComponent, newComponent)
        )
    )
    .forEach((component) => {
      currentComponents.splice(currentComponents.indexOf(component), 1);
    });
};

export type ParsingStatus = {
  type: 'parsing';
};

export type ErrorStatus = {
  type: 'error';
  error: string;
};

export type SuccessStatus = {
  type: 'success';
};

export type ParserStatus = ParsingStatus | ErrorStatus | SuccessStatus;

export type onStatusChangeCb = (status: ParserStatus) => void;
