import { Component } from '@angular/core';
import { COORDINATES } from '../../core/constantes/coordinates';

@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class Blog {
  city_table: Array<[string]> = [];

  ngOnInit(): void {
    COORDINATES.forEach((city) => {
      if (city.name != '') this.city_table.push([city.name]);
    });
  }
}
