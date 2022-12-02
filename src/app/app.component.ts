import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CentralRequestService } from './core/central-request.service';
import { ClockIconComponent } from './shared/components/clock-icon/clock-icon.component';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [FormsModule, CommonModule, ClockIconComponent],
  template: `
    <main class="min-h-screen w-full bg-slate-900">
      <article class="p-5">
        <form (ngSubmit)="makeRequest()">
          <label
            for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-gray-300"
            >Search</label
          >
          <div class="relative">
            <div
              class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none"
            >
              <svg
                class="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              #searcher
              type="search"
              id="default-search"
              [(ngModel)]="query"
              name="any"
              class="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Your scribd document here..."
              required
            />
            <button
              [disabled]="!query"
              type="submit"
              class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </article>

      <ng-container *ngIf="(doc$| async) as doc">
        <article class="text-white p-5" *ngIf="!isLoading" [innerHTML]="doc"></article>
      </ng-container>

      <article *ngIf="isLoading" class="min-h-[90vh] flex justify-center items-center">
        <span class="w-16 block">
          <app-clock-icon></app-clock-icon>
        </span>
      </article>
    </main>
  `,
})
export class AppComponent {

  public query = '';
  public doc$: Observable<string> = new BehaviorSubject('');
  public isLoading = false;

  constructor(private request: CentralRequestService, private DOMSanitizer: DomSanitizer) {}

  public makeRequest() {
    this.isLoading = true;
    this.doc$ = this.request.post<string[]>('http://localhost:8000/doc', JSON.stringify({
      url: this.query,
      site: 'scribd'
    })).pipe(map((doc) => {
      const sanitizeContent = doc.reduce((init, content) => {
        init += content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/""/g, "").replace(/&nbsp;/g, '').replace(/^"/g, '').replace(/"$/g, '');
        return init.trim();
      }, '');
      this.isLoading = false;
      return sanitizeContent;
    }))
  }

}
