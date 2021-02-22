import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MongogetService {
  
  constructor(private http: HttpClient) { }

  insertRecherche(json){
    return this.http.post('http://localhost:8080/api/insertRecherche/', json)
  }
  
  getRecherche(name){
    return this.http.get('http://localhost:8080/api/getRecherche?name='+name)
  }

  updateRecherche(json){
    return this.http.post('http://localhost:8080/api/updateRecherche/', json)
  }
}

