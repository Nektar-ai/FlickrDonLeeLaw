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
  img1024: string;
  imgOrigin: any;

  // @Output() createImg= new EventEmitter<any>();

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

  search(event) {
    this.keyword = event.target.value.toLowerCase();
    if (this.keyword && this.keyword.length > 2) {
      this.flickrGetService.search_keyword(this.keyword).toPromise().then(res => {
        this.images = res;
      });
    }
    event.target.blur();
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

  onImageClick(event) {
    document.querySelector(".containerImg").setAttribute("style","filter: blur(10px)")
    document.querySelector(".blurrer").setAttribute("style","display: block");
    document.querySelector(".original").setAttribute("style","display: block");
    this.img1024 = event.target.getAttribute("src").replace("_m.jpg","_b.jpg");
    let picID = event.target.getAttribute("id");
    this.imgOrigin = this.flickrGetService.getBigPic(picID)
    console.log(this.imgOrigin)
    // console.log(imgOriginObj.height, imgOriginObj.width)
    // this.imgOrigin2 = this.flickrGetService.getBigPic(picID);
    // console.log(this.imgOrigin2)
  }

  onBlurrerClick(event){
    document.querySelector(".containerImg").setAttribute("style","filter: unset")
    event.target.style.display = "none";
    event.target.nextElementSibling.firstElementChild.style.display = "none";
    this.img1024 = "";
  }

  getBigPic (id: string): any 
  {
    return this.flickrGetService.getSize(id).subscribe (data =>{
      let sizeList = data["sizes"]["size"];
      let imgOriginObj = sizeList.pop();
      this.imgOrigin = imgOriginObj["source"]
      console.log(this.imgOrigin)
      console.log(imgOriginObj.height, imgOriginObj.width)
    })
  }
}

  // onCreate(event) {
  //   // alert("ok");
  //   if (event.target.width*3 < event.target.height || event.target.height*3 < event.target.width)  
  //       event.target.style.display = "none"; 
  // }