import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorage } from '@angular/fire/storage';
import { NgxImageCompressService } from 'ngx-image-compress';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  courses: any;
  tutos: any;

  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  constructor(private db: AngularFireDatabase, private imageCompress: NgxImageCompressService,private afStorage: AngularFireStorage) {

  }

  compressFile(event) {
    console.log(event);
    
    this.imageCompress.uploadFile().then(({ image, orientation }) => {

      this.imgResultBeforeCompress = image;
      console.warn('Size in bytes was:', this.imageCompress.byteCount(image));

      this.imageCompress.compressFile(image, orientation, 50, 50).then(
        result => {
          this.imgResultAfterCompress = result;
          console.log(result);
          this.afStorage.upload('/upload', result);  
          const tutorialsRef = this.db.list('images');

          tutorialsRef.push({ title: 'image', image: this.imgResultAfterCompress });
          console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
        }
      );

    });

  }

  ngOnInit() {


    this.courses=this.db.list('/images').valueChanges()
    .subscribe(courses => {
      console.log(courses); // Check the returned values;
      this.tutos = courses;
    })

    this.courses = this.db.list('/courses').valueChanges()
      .subscribe(courses => {
        console.log(courses); // Check the returned values;
        this.courses = courses;
      })
  }
  title = 'angularproject';
}
