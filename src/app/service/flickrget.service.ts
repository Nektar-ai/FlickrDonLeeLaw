import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

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
  mediaType: string;
  dateMin: number;
  dateMax: number;
  imgOrigin: any;

  constructor(private http: HttpClient) { }

  getSize(photoID): any {
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }
  
  getInfo(photoID){
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${environment.flickrKey.key}&photo_id=${photoID}&format=json&nojsoncallback=1`);
  }

  getOwnersImgs(owner){
    return this.http.get(`https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=${environment.flickrKey.key}&user_id=${owner}&format=json&nojsoncallback=1`);
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
        //console.log(res.photos.photo);
        //console.log(params);
        if (pic.farm != "0")
          urlArr.push(photoObject);
      });
      
      return urlArr;
      
    }));
  }

  setMedia(type: string): void {
    this.mediaType = type;    
  }

  setDateMin(min: number): void {
    this.dateMin = min;
  }

  setDateMax(max: number): void {
    this.dateMax = max;
  }
}
