import { Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FlickrgetService } from '../service/flickrget.service';

@Component({
  selector: 'app-imgs-search',
  templateUrl: './imgs-search.component.html',
  styleUrls: ['./imgs-search.component.css']
})
export class ImgsSearchComponent implements OnInit {

  images = [];
  keyword: string;

  @Output() createImg= new EventEmitter<any>(); 

  constructor(private flickrGetService: FlickrgetService, private elem: ElementRef) { }

  ngOnInit(): void { }

  // ngAfterViewChecked() { // C'est le premier élément du cycle de vie, avec lesquels j'ai pu lire le contenu des balises img.. 
  //                         // avant ça, le *ngFor let image of images ne semblait pas avoir eu lieu
     
  //   let imGs = this.elem.nativeElement.querySelectorAll('.imgTest')

  //   imGs.forEach(e => {
  //     if (e.width*3 < e.height || e.height*3 < e.width)
  //     {  
  //       e.style.height = "0";
  //       e.style.width = "0";
  //       e.parentNode.parentNode.style.display = "none"; // ici ça vient pointer sur la div, qui contient une balise <a>, qui contient la balise <img>
  //                                                       // oui, la balise <a> sera transformée en div pour un affichage directement dans la page des photos en taille originale
  //     }
  //   });
  // }

  search(event: any) {
    this.keyword = event.target.value.toLowerCase();
    if (this.keyword && this.keyword.length > 2) {
      this.flickrGetService.search_keyword(this.keyword).toPromise().then(res => {
        this.images = res;
      });
    }
  }

  onScroll() {    
    if (this.keyword && this.keyword.length > 0) {
      this.flickrGetService.search_keyword(this.keyword)
        .toPromise()
        .then(res => {
          this.images = this.images.concat(res);
        });
    }
  }

  onCreate(event) {
    // alert("ok");
    if (event.target.width*3 < event.target.height || event.target.height*3 < event.target.width)  
        event.target.style.display = "none"; 
  }
}
