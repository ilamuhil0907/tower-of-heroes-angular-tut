import { Injectable, NgModule } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { catchError, Observable, of, tap } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesUrl = 'api/heroes';
  httpOptions = new HttpHeaders({ 'Content-type': 'application/json' });
  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) {}
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap((_: any) => this.log('HeroService: fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap((_: any) => this.log(`HeroService: fetched hero id=${id}`)),
      catchError(this.handleError<Hero>('getHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}`;
    return this.http.post<Hero>(url, hero, { headers: this.httpOptions }).pipe(
      tap((_: any) => {
        this.log(`added hero to server`);
      }),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  updateHero(hero: Hero) {
    return this.http
      .put(this.heroesUrl, hero, { headers: this.httpOptions })
      .pipe(
        tap((_: any) => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
  }

  deleteHero(id: number) {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, { headers: this.httpOptions }).pipe(
      tap((_: any) => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  
  searchHeroes(name: string): Observable<Hero[]> {
    if (!name.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    const url = `${this.heroesUrl}/?name=${name}`;
    return this.http.get<Hero[]>(url).pipe(
      tap((x) => {
        x.length
          ? this.log(`found heroes matching ${name}`)
          : this.log(`No heroes found matching ${name}`);
      }),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
