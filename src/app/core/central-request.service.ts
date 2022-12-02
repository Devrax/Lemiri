import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CentralRequestService {

  constructor(
    private http: HttpClient
  ) { }

  public post<T>(url: string, data: unknown): Observable<T>  {
    return this.http.post<T>(url, data);
  }
}
