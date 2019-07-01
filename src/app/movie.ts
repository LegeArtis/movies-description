export class Movie {
  public title: string;
  public stars: string[];
  public year: number;
  public format: string;
  public id: number;

  constructor(title, stars, year, format, id?) {
    this.title = title;
    this.stars = stars;
    this.year = year;
    this.format = format;
    if (id) {
      this.id = id;
    }
  }
}
