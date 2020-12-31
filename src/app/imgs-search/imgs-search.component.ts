import { Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { FlickrgetService } from '../service/flickrget.service';

@Component({
  selector: 'app-imgs-search',
  templateUrl: './imgs-search.component.html',
  styleUrls: ['./imgs-search.component.css']
})
export class ImgsSearchComponent implements OnInit {

  images = [];
  keyword: string;
  imgOrigin: string;

  // faire une class Nektar
  titre: string;
  description: string;
  owner: string;
  date: string;


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

  onImageClick(event) {
    document.querySelector(".containerImg").setAttribute("style","filter: blur(10px)")
    document.querySelector(".blurrer").setAttribute("style","display: block");
    document.querySelector(".imgContainer").setAttribute("style","display: flex");
    document.querySelector(".info").setAttribute("class","info");

    this.imgOrigin = event.target.getAttribute("src").replace("_m.jpg","_b.jpg");
    this.getImginfo(event);
  }

  onBlurrerClick(event){
    document.querySelector(".containerImg").setAttribute("style","filter: unset")
    document.querySelector(".info").innerHTML = "i";
    event.target.style.display = "none";
    event.target.nextElementSibling.style.display = "none";
    this.imgOrigin = "";
  }

  getImginfo(event){
    this.flickrGetService.getInfo(event.target.getAttribute("id")).subscribe(data => {
      this.titre = data["photo"]["title"]["_content"];
      this.description = data["photo"]["description"]["_content"];
      this.owner = data["photo"]["owner"]["username"];
      this.date = data["photo"]["dates"]["taken"];
      console.log(data)
    })
  }

  showInfo(event){
    if (event.target.getAttribute("class") == "info") {
      event.target.setAttribute("class","info infoShow")
      event.target.innerHTML = "";
      setTimeout(() => {
        event.target.innerHTML = this.titre + "<br><br>description :<br>" + this.description + "<br>owner :<br>" + this.owner + "<br>date :<br>" + this.date + "<br>";
      }, 500);
    }else{
      event.target.setAttribute("class","info")
      event.target.innerHTML = "";
      setTimeout(() => {
        event.target.innerHTML = "i";
      }, 1000);
    }
  }
}
