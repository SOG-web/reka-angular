// import {Component, Input} from '@angular/core';
// import * as t from '@rekajs/types';
// import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
//
// @Component({
//   selector: 'app-renderer',
//   standalone: true,
//   imports: [
//     NgIf,
//     NgSwitch,
//     NgSwitchCase,
//     NgSwitchDefault,
//     NgForOf
//   ],
//   template: `
//     <ng-container *ngIf="view; else noView">
//       <ng-container [ngSwitch]="view.constructor">
//         <ng-container *ngSwitchCase="tagViewConstructor">
//           <ng-container [ngSwitch]="view.tag">
//             <span *ngSwitchCase="'text'">{{ view.props.value }}</span>
//             <ng-container *ngSwitchDefault>
//               <{{ view.tag }} [ngStyle]="view.props.style">
//                 <app-renderer *ngFor="let child of view.children" [view]="child"></app-renderer>
//               </{{ view.tag }}>
//             </ng-container>
//           </ng-container>
//         </ng-container>
//         <ng-container *ngSwitchCase="rekaComponentViewConstructor">
//           <ng-container *ngFor="let r of view.render">
//             <app-renderer [view]="r"></app-renderer>
//           </ng-container>
//         </ng-container>
//         <ng-container *ngSwitchCase="externalComponentViewConstructor">
//           {{ view.component.render(view.props) }}
//         </ng-container>
//         <ng-container *ngSwitchCase="slotViewConstructor">
//           <app-renderer *ngFor="let r of view.children" [view]="r"></app-renderer>
//         </ng-container>
//         <ng-container *ngSwitchCase="errorSystemViewConstructor">
//           <div class="">
//             Something went wrong. <br />
//             {{ view.error }}
//           </div>
//         </ng-container>
//       </ng-container>
//     </ng-container>
//     <ng-template #noView></ng-template>
//   `,
//   styles: ['']
// })
// export class RendererComponent {
//   @Input() view: t.View | null = null;
//   tagViewConstructor = t.TagView;
//   rekaComponentViewConstructor = t.RekaComponentView;
//   externalComponentViewConstructor = t.ExternalComponentView;
//   slotViewConstructor = t.SlotView;
//   errorSystemViewConstructor = t.ErrorSystemView;
//
// }
