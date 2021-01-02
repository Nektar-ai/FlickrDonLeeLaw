import { Component, Input, OnInit } from '@angular/core';
import { FlickrgetService } from '../service/flickrget.service';

@Component({
  selector: 'app-filtre-images',
  templateUrl: './filtre-images.component.html',
  styleUrls: ['./filtre-images.component.css']
})
export class FiltreImagesComponent implements OnInit {

  media: string = "all";
  dateMin: number = 0;
  @Input() uploadMin: string;
  dateMax: number = Date.now();
  @Input() uploadMax: string;

  public constructor(private flickr: FlickrgetService) {
    this.flickr.setMedia(this.media);
    this.flickr.setDateMin(this.dateMin);
    this.flickr.setDateMax(this.dateMax);
   }

  ngOnInit(): void {
  }

  setMediaType(type: string): void {
    this.media = type;
    this.flickr.setMedia(this.media);
  }

  setDateUploadMin(): void {
    this.dateMin = Date.parse(this.uploadMin);
    this.flickr.setDateMin(this.dateMin);
  }

  setDateUploadMax(): void {
    this.dateMax = Date.parse(this.uploadMax);
    this.flickr.setDateMax(this.dateMax);
  }

}
