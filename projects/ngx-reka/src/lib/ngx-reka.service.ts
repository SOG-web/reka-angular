import { Injectable } from '@angular/core';
import { Reka } from '@rekajs/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

export type Collector<C extends Record<string, any>> = (reka: Reka | null) => C;

@Injectable({
  providedIn: 'root'
})
export class NgxRekaService {
  private rekaSubject = new BehaviorSubject<Reka | null>(null);
  reka$ = this.rekaSubject.asObservable();

  program$ = this.reka$.pipe(map(reka => reka ? reka.program : null));

  setReka(reka: Reka) {
    this.rekaSubject.next(reka);
  }

  provideReka(reka: Reka) {
    this.setReka(reka);
  }

  collectData<C extends Record<string, any>>(collector: Collector<C>): Observable<C> {
    return this.reka$.pipe(
      map((reka) => {
        if (!reka) {
          throw new Error('Reka is not available.');
        }
        return collector(reka);
      })
    );
  }
}
