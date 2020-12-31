import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

import 'flickr-sdk';

export interface FlickrPic {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
}

export interface FlickrOut {
  photos: {
    photo : FlickrPic[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class FlickrgetService {

  prevKeyword: string;
  currPage = 1;
  imgHeight = 0;
  imgWidth = 0;
  ok = false;

  constructor(private http: HttpClient) { }

  getSize(photoID): any {
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }

  search_keyword(keyword: string) { // Fonction appelée depuis le composant qui présente l'input à l'utilisateur pour taper ses champs de recherche

    if (this.prevKeyword === keyword) {        
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;

    const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&";
    const params = `api_key=${environment.flickrKey.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=48&page=${this.currPage}`;

    return this.http.get(url + params).pipe(map((res: FlickrOut) => {
      const urlArr = [];
      res.photos.photo.forEach((pic: FlickrPic) => {
        let photoObject = {
          id: pic.id,
          url: `https://farm${pic.farm}.staticflickr.com/${pic.farm}/${pic.id}_${pic.secret}`,
          title: pic.title,

        };

        if (pic.farm != "0")
          urlArr.push(photoObject);
      });

      const urlArrFinal = [];
      
      // urlArr.forEach((picObj: any) => { // Ici, c'est ma 2ème tentative, la 1ère était au dessus du if (pic.farm....)
        
      //   this.getSize(picObj.id).subscribe (data =>{

      //   let sizeList = data["sizes"]["size"]; // sizeList ici devient la liste des différents tailles disponibles pour la même photo
      //   var lastSize = sizeList.pop();        // la dernière est toujours la plus grande, donc c'est sur celle ci que je vais faire la vérification
      //   console.log(lastSize.height, lastSize.width)
      //   if (lastSize.height*3 > lastSize.width && lastSize.width*3 < lastSize.height)
      //     urlArrFinal.push(picObj)
          
      // })});

      //return urlArrFinal;
      return urlArr;
      
    }));
  }

  getInfo(photoID){
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }
}


        // this.getSize(pic.id).toPromise().then(data =>{
        //   let sizeList = data["sizes"]["size"];
        //   let ok = false;
        //   console.log(sizeList);
        //   var lastSize = sizeList.pop();
          
        //   console.log(lastSize);

        // console.log(photoObject.sizes)

        // let picOri = this.getOriginal(pic.id).subscribe(data => {
        //   let url = data["source"]
        //   console.log(url)
        // })
        
        // console.log(picOri)

        // let sizes2 = getSize2(pic.id, this.http)
        // console.log("Valeur de sizes2 :"+sizes2);



        // var picSize = this.getSize(pic.id);
        // console.log(picSize);

        // var picInfo = this.getInfo(pic.id);
        // console.log(picSize);
        // console.log(res);
        // console.log(pic);
        // console.log(photoObject.url);
        // var lastSize;
        
        // let width: number;
        // let height: number = 1;
        
        
        // var sizesList = this.getSize(pic.id).map(data =>{
        //   let sizeList = data["sizes"]["size"]
        //   var lastSize = sizeList.pop();
        //   pic.height = lastSize.height; 
        //   pic.width = lastSize.width;
        // });
        
        // let promise = new Promise (resolve => {
        
        //   setTimeout(() => resolve(this.getSize(pic.id).toPromise().then(data =>{
        //     let sizeList = data["sizes"]["size"];
        //     let ok = false;
        //     var lastSize = sizeList.pop();
        //     console.log(lastSize);
        //     pic.height = lastSize.height; 
        //     pic.width = lastSize.width;
        //     return lastSize.width;
        //     )), 1000);                  
        // }});
        // promise.then(console.log());
        // let promise2 = promise.resolve();
        // console.log(typeof(lastSize));


        // var divImg = document.getElementById("pictures");
      // divImg.style.opacity = "1";
      // divImg.style.transition = "all 0.5s ease";
      
      // setTimeout(() => {
      //   divImg.style.opacity = "1";
      // }, 2000);

            // this.getSize(pic.id).subscribe (data =>{
      // let sizeList = data["sizes"]["size"];
      // let sizesIn: number[]
      // let ok = false;
      // console.log(pic)
      // console.log(sizeList);
      // var lastSize = sizeList.pop();
      // console.log(lastSize);
      // console.log(lastSize.height);
      // console.log(lastSize.width);
      // sizesIn.push(lastSize.height);
      // sizesIn.push(lastSize.width);        
      //   if (lastSize.height*3 > lastSize.width && lastSize.width*3 > lastSize.height)
      //     photoObject = null;
      // })

      // })