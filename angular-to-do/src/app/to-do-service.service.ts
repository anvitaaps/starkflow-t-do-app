import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import {Observable} from 'rxjs/Observable';
// import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';
import { List } from './models/list';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ToDoServiceService {

  constructor(private http: HttpClient) { }

  private serverApi= 'http://localhost:3000';

  public getAllLists():Observable<List[]> {

      let URI = `${this.serverApi}/to-do/`;
      return this.http.get(URI,   {
          headers: new HttpHeaders({'Content-Type': 'application/json'}), 
        })
        .pipe(map(
          (data) => <List[]>data
        ));
      // return this.http.get(URI)
      //     .pipe(map(res => res))
      //     .pipe(map(res => <List[]>res));
  }

  public deleteList(listId : string) {
    let URI = `${this.serverApi}/to-do/${listId}`;
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      return this.http.delete(URI,   {
        headers: new HttpHeaders({'Content-Type': 'application/json'}), 
      })
      .pipe(map(
        (data) => data
      ));
  }

  public addList(list: List) {
    let URI = `${this.serverApi}/to-do/`;
    let headers = new Headers;
     let body = JSON.stringify({title: list.title, description: list.description});
     console.log(body);
    return this.http.post(URI, body,  {
      headers: new HttpHeaders({'Content-Type': 'application/json'}), 
    })
    .pipe(map(
      (data) => data
    ));
  }

  public updateList(listId : string, list: List) {
    let URI = `${this.serverApi}/to-do/${listId}`;
    let headers = new Headers;
    let body = JSON.stringify({title: list.title, description: list.description});
    console.log(body);
    return this.http.put(URI, body,  {
      headers: new HttpHeaders({'Content-Type': 'application/json'}), 
    })
    .pipe(map(
      (data) => data
    ));
  }
}
