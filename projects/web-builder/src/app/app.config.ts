import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgxRekaService } from 'ngx-reka';
import { NgxRekaEditorService } from 'ngx-reka-editor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),NgxRekaService, NgxRekaEditorService]
};
