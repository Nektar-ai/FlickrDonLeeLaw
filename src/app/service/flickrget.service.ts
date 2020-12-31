import { Injectable, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

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
  // imgHeight = 0;
  // imgWidth = 0;
  mediaType: string;
  dateMin: number;
  dateMax: number;
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
    const params = `api_key=${environment.flickrKey.key}&text=${keyword}&media=${this.mediaType}&min_upload_date=${this.dateMin}&max_upload_date=${this.dateMax}&format=json&nojsoncallback=1&per_page=48&page=${this.currPage}`;

    return this.http.get(url + params).pipe(map((res: FlickrOut) => {
      const urlArr = [];
      res.photos.photo.forEach((pic: FlickrPic) => {
        const photoObject = {
          id: pic.id,
          url: `https://farm${pic.farm}.staticflickr.com/${pic.farm}/${pic.id}_${pic.secret}`,
          title: pic.title          
        };
        console.log(pic);
        if (pic.farm != "0")
          urlArr.push(photoObject);
      });
      
      return urlArr;
      
    }));
  }

  getBigPic (id: string): any 
  {
    return this.getSize(id).subscribe (data =>{
      let sizeList = data["sizes"]["size"];
      let imgOriginObj = sizeList.pop();
      let imgOrigin = imgOriginObj["source"]
      return imgOrigin;
    })
  }

  setMedia(type: string): void {
    this.mediaType = type;
    console.log("SET SERVICE MEDIA", this.mediaType);
  }

  setDateMin(min: number): void {
    this.dateMin = min;
    console.log("SET SERVICE MIN", this.dateMin);
  }

  setDateMax(max: number): void {
    this.dateMax = max;
    console.log("SET SERVICE MAX", this.dateMax);
  }

  getInfo(photoID){
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }

  getOwnersImgs(owner){
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${environment.flickrKey.key}&user_id=${owner}&format=json&nojsoncallback=1`);
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

  // getBigPic (id: string): any 
  // {
  //   return this.getSize(id).subscribe (data =>{

  //     let sizeList = data["sizes"]["size"];
  //     // var lastSize = sizeList.pop();
  //     this.oriPic = sizeList.pop();
  //     console.log(this.oriPic)
  //     console.log(this.oriPic.height, this.oriPic.width)
  //     return this.oriPic;
  //   })
  // }