import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
// import * as FlickrObject from 'flickr-sdk';
import 'flickr-sdk';

export interface FlickrPic {
  farm: string;
  id: string;
  secret: string;
  server: string;
  title: string;
  // height: number;
  // width: number;
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
  // ok: boolean = false;
  // flickr = new FlickrObject;
  // Flickr = require('flickr-sdk');

  constructor(private http: HttpClient) { }
  
  // getInfo(photoID): Observable<any>{
  //   return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  // }

  getSize(photoID): any {
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }

  getSize2(photoID, http2: HttpClient): number[] {
    let sizes: number[];
    let url2 = http2.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
    console.log(url2);
    url2.subscribe(data =>{
      let sizeList = data["sizes"]["size"];
      let sizesIn: number[];
      var lastSize = sizeList.pop();
      console.log(sizeList);
      console.log(lastSize);
      console.log(lastSize.height);
      sizesIn.push(lastSize.height);
      sizesIn.push(lastSize.width);
      sizes = sizesIn
    })
    return sizes;
  }

  getOriginal(photoID): any {
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1&extras=url_o`);
  }

  search_keyword(keyword: string) {

    if (this.prevKeyword === keyword) {        
      this.currPage++;
    } else {
      this.currPage = 1;
    }
    this.prevKeyword = keyword;

    const url = "https://www.flickr.com/services/rest/?method=flickr.photos.search&";
    const params = `api_key=${environment.flickrKey.key}&text=${keyword}&format=json&nojsoncallback=1&per_page=24&page=${this.currPage}`;

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

      // console.log(urlArr)
      let urlArrFinal = [];
      urlArr.forEach((picObj: any) => {
        
        let picSizes = this.getSize(picObj.id).subscribe (data =>{
        // console.log(picObj.id)
          let sizeList = data["sizes"]["size"];
        // console.log(sizeList)
        var lastSize = sizeList.pop();
        // console.log(lastSize);
        // console.log(picSizes)
        if (lastSize.height*3 > lastSize.width && lastSize.width*3 < lastSize.height)
          urlArrFinal.push(picObj)
          
      })});
      
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
      // return sizesIn
      // })

      setTimeout(() => {
        
      }, 2000);
      // return urlArrFinal
      return urlArr;
      
    }));
  }
}


        // this.getSize(pic.id).toPromise().then(data =>{
        //   let sizeList = data["sizes"]["size"];
        //   let ok = false;
        //   console.log(sizeList);
        //   var lastSize = sizeList.pop();
          
        //   console.log(lastSize);
        //   if (lastSize.height*3 > lastSize.width && lastSize.width*3 > lastSize.height)
        //     photoObject = null;
        // })
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

        

        // this.getSize(pic.id).subscribe(async data =>{
        //   let sizeList = await data["sizes"]["size"];
          
        //   var lastSize = sizeList.pop();
        //   console.log(lastSize);
        //   pic.height = lastSize.height; 
        //   pic.width = lastSize.width;
        //   console.log(pic.height);

        //   if (lastSize.height*3 > lastSize.width && lastSize.width*3 > lastSize.height)
        //   // if (height*3 > width && width*3 > height)
        //     this.ok = true;                    
        // })
        // console.log(lastSize);
        // console.log(lastSize.height);
        // console.log(lastSize.width);
        // console.log(pic.height);
        // console.log(pic.width);
        // console.log(ok);


              // var divImg = document.getElementById("pictures");
      // divImg.style.opacity = "1";
      // divImg.style.transition = "all 0.5s ease";
      
      // setTimeout(() => {
      //   divImg.style.opacity = "1";
      // }, 2000);