import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FlickrgetService } from '../service/flickrget.service';
import { MongogetService } from '../service/mongoget.service';


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
  titre: string;
  description: string;
  owner: string;
  date: string;

  @Output() createImg= new EventEmitter<any>(); 

  constructor(private flickrGetService: FlickrgetService,private mongoGetService: MongogetService) { }

  ngOnInit(): void { }

  search(event) {
    this.keyword = event.target.value.toLowerCase();
    if (this.keyword && this.keyword.length > 2) {
      this.mongoGetService.getRecherche(this.keyword).subscribe(data => {
        if (data != null) {
          this.images = data['urls'];
          this.flickrGetService.currPage = data['currPage'];
          this.flickrGetService.prevKeyword = this.keyword;
        }else{
          this.flickrGetService.search_keyword(this.keyword).subscribe(res => {
            if (res != null) {
              this.images = res;
              this.mongoGetService.insertRecherche({name:this.keyword,currPage:this.flickrGetService.currPage,date:new Date().getTime(),urls:this.images}).subscribe(data => {
                console.log(data);
              })
            }
          });
        }
      })
      
    }
    event.target.blur();
  }

  onScroll() {    
    if (this.keyword && this.keyword.length > 0) {
      this.flickrGetService.search_keyword(this.keyword)
        .toPromise()
        .then(res => {
          this.images = this.images.concat(res);
          console.log(this.images.length);
          if (this.images.length % 48 != 0) {
            this.mongoGetService.updateRecherche({name:this.keyword,currPage:this.flickrGetService.currPage, date:new Date().getTime(),urls:this.images}).subscribe(data => {
              console.log(data);
            })
          }
        });
    }
  }

  onImageClick(event) {
    document.querySelector(".containerImg").setAttribute("style","filter: blur(10px)")
    document.querySelector(".blurrer").setAttribute("style","display: block");
    document.querySelector(".original").setAttribute("style","display: block");
    this.img1024 = event.target.getAttribute("src").replace("_m.jpg","_b.jpg");

    document.querySelector(".imgContainer").setAttribute("style","display: flex");
    document.querySelector(".info").setAttribute("class","info");

    this.getImgInfo(event);
  }

  onBlurrerClick(event){
    document.querySelector(".containerImg").setAttribute("style","filter: unset")
    document.querySelector(".info").innerHTML = "i";
    event.target.style.display = "none";
    event.target.nextElementSibling.style.display = "none";    
    this.img1024 = "";
  }

  getImgInfo(event){
    this.flickrGetService.getInfo(event.target.getAttribute("id")).subscribe(data => {
      this.titre = data["photo"]["title"]["_content"];
      this.description = data["photo"]["description"]["_content"];
      this.owner = data["photo"]["owner"]["username"];
      this.date = data["photo"]["dates"]["taken"];
      this.getOwnerImage(data["photo"]["owner"]["nsid"]);
    })
  }

  showInfo(){
    if (document.querySelector(".info").getAttribute("class") == "info") {
      document.querySelector(".info").setAttribute("class","info infoShow")
      document.querySelector(".owners").setAttribute("class","owners ownersSlide")
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = "<h4>" + this.titre.toUpperCase().bold() + "</h4><br><strong><u>Description</u></strong><br>" + this.description + "<br><br><strong><u>Owner</u></strong><br>" + this.owner + "<br><br><strong><u>Date</u></strong><br>" + this.date.slice(0,10) + "<br>";
      }, 500);
    } else {
      document.querySelector(".info").setAttribute("class","info")
      document.querySelector(".owners").setAttribute("class","owners")
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = "i";
      }, 1000);
    }
  }

  getOwnerImage(owner){
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

  ownerImgClick(event){
    document.querySelector(".original").setAttribute("src","");
    this.img1024 = event.target.alt;
    this.getImgInfo(event);
    if (document.querySelector(".info").innerHTML != "i") {
      document.querySelector(".info").innerHTML = "";
      setTimeout(() => {
        document.querySelector(".info").innerHTML = this.titre.toUpperCase().bold() + "<br><br><strong>Description :</strong><br>" + this.description + "<br><br><strong>Owner :</strong><br>" + this.owner + "<br><br><strong>Date :</strong><br>" + this.date.slice(0,10) + "<br>";
      }, 500);
    }
  }
}
