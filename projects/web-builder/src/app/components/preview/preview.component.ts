import {Component, OnInit, signal} from '@angular/core';
import {NgxRekaService} from "../../../../../ngx-reka/src/lib/ngx-reka.service";
import {Frame, Reka} from "@rekajs/core";
import {reka} from "@rekajs/codemirror";
import * as console from "node:console";
import {error} from "ng-packagr/lib/utils/log";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  template: `
    <div class="w-full h-full flex flex-col text-xs">
      <div class="px-2 py-2 border-b-2">
        <select (change)="selectFrame($event.target.value)">
          <option *ngFor="let frame of reka.frames" [value]="frame.id">
            {{ frame.id }}
          </option>
        </select>
      </div>
      <div class="flex-1 px-2 py-2">
        <ng-container *ngIf="selectedFrame(); else noFrameSelected">
<!--          <app-renderer [view]="selectedFrame.view"></app-renderer>-->
        </ng-container>
        <ng-template #noFrameSelected>
          <div class="px-3 py-4">No frame selected</div>
        </ng-template>
      </div>
    </div>
  `,
  styles: ['']
})
export class PreviewComponent implements OnInit {

  reka!: Reka;
  selectedFrame = signal<Frame | null>(null)

  constructor(private ngxRekaService: NgxRekaService) {}

  ngOnInit(): void {
    this.ngxRekaService.reka$.subscribe({
      next: reka => {
        if(reka) {
          this.reka = reka;
          this.selectedFrame.set(reka.frames[0])
          return;
        }
        alert('Reka not found')
      },
      error: error => console.log(error),
    });
  }

  selectFrame(frameId: string) {
    const frame = this.reka.getFrame(frameId)
    if(frame) {
      this.selectedFrame.set(frame)
    }
  }

}
