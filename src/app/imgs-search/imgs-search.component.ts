import { Output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { title } from 'process';
import { map } from 'rxjs/operators';
import { FlickrgetService, FlickrOut, FlickrPic } from '../service/flickrget.service';

export interface FlickrInfo {



}

@Component({
  selector: 'app-imgs-search',
  templateUrl: './imgs-search.component.html',
  styleUrls: ['./imgs-search.component.css']
})



export class ImgsSearchComponent implements OnInit {

  images = [];
  OwnerImages = [];
  keyword: string;
  img1024: string;
  imgOrigin: any;

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

    // console.log(imgOriginObj.height, imgOriginObj.width)
    // this.imgOrigin2 = this.flickrGetService.getBigPic(picID);
    // console.log(this.imgOrigin2)
    document.querySelector(".imgContainer").setAttribute("style","display: flex");
    document.querySelector(".info").setAttribute("class","info");

    // this.imgOrigin = event.target.getAttribute("src").replace("_m.jpg","_b.jpg");
    this.getImginfo(event);

    // let picID = event.target.getAttribute("id");
    // this.imgOrigin = this.flickrGetService.getBigPic(picID);
    
  }

  onBlurrerClick(event){
    document.querySelector(".containerImg").setAttribute("style","filter: unset")
    document.querySelector(".info").innerHTML = "i";
    event.target.style.display = "none";
    event.target.nextElementSibling.style.display = "none";
    // event.target.nextElementSibling.firstElementChild.style.display = "none";
    this.img1024 = "";
  }

  getBigPic (id: string): any{
    return this.flickrGetService.getSize(id).subscribe (data =>{
      let sizeList = data["sizes"]["size"];
      let imgOriginObj = sizeList.pop();
      this.imgOrigin = imgOriginObj["source"]
      console.log(this.imgOrigin)
      console.log(imgOriginObj.height, imgOriginObj.width)
    })
  }

  // getImginfo2(event){
  //   this.flickrGetService.getInfo(event.target.getAttribute("id")).pipe(map((res: FlickrOut) => {
  //     // this.titre = data["title"]["_content"];
  //     alert("IM IN");
  //     res.photos.photo.forEach ((pic: FlickrPic) => {
  //     console.log(pic);
      
  //     this.titre = pic.title
      
  //     // this.titre = photoInfo.titre
  //     this.description = pic["description"]["_content"];
  //     this.owner = pic["owner"]["username"];
  //     this.date = pic["dates"]["taken"];
  //     this.date = this.date.slice(0,10);
  //     // console.log(this.date);
  //     // console.log(data)
  //   })}))
  // }

  getImginfo(event){
    this.flickrGetService.getInfo(event.target.getAttribute("id")).subscribe(data => {
      this.titre = data["photo"]["title"]["_content"];
      this.description = data["photo"]["description"]["_content"];
      this.owner = data["photo"]["owner"]["username"];
      this.date = data["photo"]["dates"]["taken"];
      this.getOwnerimage(data["photo"]["owner"]["nsid"]);
    })
  }

  showInfo(event){
    if (document.querySelector(".info").getAttribute("class") == "info") {
      document.querySelector(".info").setAttribute("class","info infoShow")
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = this.titre.toUpperCase().bold() + "<br><br><strong>Description :</strong><br>" + this.description + "<br><br><strong>Owner :</strong><br>" + this.owner + "<br><br><strong>Date :</strong><br>" + this.date.slice(0,10) + "<br>";
      }, 500);
    } else {
      document.querySelector(".info").setAttribute("class","info")
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = "i";
      }, 1000);
    }
  }

  getOwnerimage(owner){
    this.OwnerImages = [];
    this.flickrGetService.getOwnersImgs(owner).subscribe( data => {
      var photos = data["photos"]["photo"];
      photos.forEach(element => {
        this.flickrGetService.getSize(element["id"]).subscribe( data1 => {
          const photoStruck = {
            thumbnail: data1["sizes"]["size"][0]["source"],
            original: data1["sizes"]["size"].pop()["source"],
            id: element["id"]
          }
          this.OwnerImages.push(photoStruck)
        })
      });
    })
  }

  OwnerImgclick(event){
    document.querySelector(".original").setAttribute("src","");
    this.img1024 = event.target.alt;
    this.getImginfo(event);
    if (document.querySelector(".info").innerHTML != "i") {
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = this.titre.toUpperCase().bold() + "<br><br><strong>Description :</strong><br>" + this.description + "<br><br><strong>Owner :</strong><br>" + this.owner + "<br><br><strong>Date :</strong><br>" + this.date.slice(0,10) + "<br>";
      }, 500);
    }
  }
}

  // onCreate(event) {
  //   // alert("ok");
  //   if (event.target.width*3 < event.target.height || event.target.height*3 < event.target.width)  
  //       event.target.style.display = "none"; 
  // }