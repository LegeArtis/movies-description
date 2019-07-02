import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Movie} from './movie';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('myForm', {static: false}) formValues: any;
  private movies: Movie[];
  private url = 'http://localhost:3000/';
  movieToDelete: Movie;
  deleteWindow = true;
  searchName;
  searchTitle;


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAll();
  }


  public  onSearch(title, name) {
    this.searchName = name;
    this.searchTitle = title;
    const line = `${title ? title : 'none'}&${name ? name : 'none'}`;

    this.http.get(`${this.url}search/${line}`).subscribe((data: Movie[]) => {
        this.movies = data;
        console.log(this.movies);
    });
  }

  public getAll() {
    this.http.get(`${this.url}all`).subscribe( (data: Movie[]) => {
      this.movies = data;
    });
  }

  public onAdd(title, year, format, name) {
    const formatList = ['VHS', 'DVD', 'Blu-Ray'];

    if (title && year >= 1850 && year <= 2020 && formatList.includes(format) && name) {
      const stars = name.split(',').map((elem) => elem.trim());
      const movie = new Movie(title, stars, year, format);

      console.log('Try to add');
      this.http.post(`${this.url}add`, movie).subscribe(() => console.log('onAdd OK'));

      if (this.searchName || this.searchTitle) {
        this.onSearch(this.searchTitle, this.searchName);
      } else {
        this.getAll();
      }
    }
  }

  public reallyDelete(movie) {
    this.movieToDelete = movie;
    this.deleteWindow = false;
  }

  public hideDeleteWindow() {
    this.deleteWindow = true;
  }

  public deleteMovie(movie) {
    console.log('try to delete...');
    this.http.post(`${this.url}delete/`, movie).subscribe( () => console.log('delete movie'));
    this.movies.splice(this.movies.indexOf(movie), 1);
    this.hideDeleteWindow();
    this.getAll();
  }
}

