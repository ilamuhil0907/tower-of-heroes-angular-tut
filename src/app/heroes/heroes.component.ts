import { Hero } from './../hero';
import { Component } from '@angular/core';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent {
  heroes:Hero[] = []
  selectedHero?: Hero;
  constructor(private heroService:HeroService, private messageService:MessageService){}
  onSelect(hero: Hero) {
    this.selectedHero = hero;
    this.messageService.add(`Hero selected. Selected Hero id = ${hero.id}`)
  }
  ngOnInit() {
   this.getHeroes() 
  }
  getHeroes() {
    this.heroService.getHeroes().subscribe(data=> this.heroes = data)
  }
  add(name:string) {
    this.heroService.addHero({name} as Hero).subscribe(()=> this.getHeroes())
  }
  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
