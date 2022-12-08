import { HeroService } from './../hero.service';
import { Observable,Subject } from 'rxjs';
import { Component } from '@angular/core';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent {
  heroes$!: Observable<Hero[]>;
  searchTerm = new Subject<string>();
  private searchTerms = new Subject<string>()
  constructor(private heroService:HeroService) {}
  search(value: string):void {
    this.searchTerms.next(value)
  }
  ngOnInit() {
    console.log("running");
    this.heroes$ = this.searchTerms.pipe(debounceTime(300),distinctUntilChanged(),switchMap(term=>this.heroService.searchHeroes(term)))  
  }
}
