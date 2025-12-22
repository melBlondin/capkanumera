import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CITIES, MAINCITIES } from '../../core/constants';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
@Component({
  selector: 'app-chart',
  imports: [],
  templateUrl: './chart.html',
  styleUrl: './chart.css',
})
export class MyChart {
  private root!: am5.Root;
  Xposition!: number;
  Yposition!: number;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private zone: NgZone) {}

  // Run the function only in the browser
  browserOnly(f: () => void) {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngAfterViewInit() {
    // Chart code goes in here
    this.browserOnly(() => {
      // Create root
      var root = am5.Root.new('chartdiv');

      // Set themes
      root.setThemes([am5themes_Animated.new(root)]);

      // Create chart
      var chart = root.container.children.push(
        am5map.MapChart.new(root, {
          panX: 'rotateX',
          panY: 'none',
          projection: am5map.geoNaturalEarth1(),
        })
      );

      chart.set(
        'background',
        am5.RoundedRectangle.new(root, {
          fill: am5.color(0x03224c),
        })
      );

      // Create polygon series
      var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ'],
        })
      );

      //Put the countries background  in grey color
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xdadada),
      });

      //Zooming to the starting point
      polygonSeries.events.on('click', function () {
        // changed from locationChart.events.on(...
        chart.zoomToGeoPoint(
          {
            longitude: 3.0282,
            latitude: 42.9103,
          },
          32
        );
      });

      // Create point series for Main cities
      var pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
        })
      );
      // Create regular bullets for main cities
      pointSeries.bullets.push(function () {
        var circle = am5.Circle.new(root, {
          radius: 10,
          fill: am5.color(0xf00020),
          fillOpacity: 0.75,
          cursorOverStyle: 'pointer',
        });

        //Adding popup display on click
        //console.log(pointSeries.dataItems); montre le tableau pointSeries

        circle.events.on('click', (e) => {
          if (e.target.dataItem) {
            let cible: any = e.target.dataItem.dataContext;
            let city: any = cible.name;
            var Xposition = e.point.x;
            var Yposition = e.point.y;
            var cityName = cible.name;
            console.log(cityName);
            return cityName;
          }
          console.log(cityName);
        });

        return am5.Bullet.new(root, {
          sprite: circle,
        });
      });
      this.showPopUp(this.Xposition, this.Yposition, 'lola');

      // Create point series for  secondary cities
      var secondaryPointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
        })
      );

      // Create regular bullets for secondary cities
      secondaryPointSeries.bullets.push(function () {
        var secondaryCircle = am5.Circle.new(root, {
          radius: 8,
          tooltipY: 0,
          fill: am5.color(0xf00020),
          fillOpacity: 0.75,
          tooltipText: '{title}',
        });

        return am5.Bullet.new(root, {
          sprite: secondaryCircle,
        });
      });

      //ajout label villes principales
      pointSeries.bullets.push(function () {
        var label = am5.Label.new(root, {
          populateText: true, //permet de lire les variables des data sinon lit en mode "string"
          text: '{name}',
          centerX: am5.p0,
          centerY: 0,
          fontSize: 20,
          fontWeight: 'bold',
          fill: am5.color(0xffffff),
          paddingTop: 14,
          paddingLeft: 16,
          paddingRight: 16,
        });

        label.set(
          'background',
          am5.RoundedRectangle.new(root, {
            fill: am5.color(0xf00020),
            fillOpacity: 0.55,
            cornerRadiusBL: 3,
            cornerRadiusBR: 3,
            cornerRadiusTL: 3,
            cornerRadiusTR: 3,
          })
        );

        return am5.Bullet.new(root, {
          sprite: label,
          locationX: 0,
        });
      });

      //ajout label villes secondaires
      pointSeries.bullets.push(function () {
        var secondaryLabel = am5.Label.new(root, {
          populateText: true, //permet de lire les variables des data sinon lit en mode "string"
          text: '{name}',
          centerX: am5.p0,
          centerY: 0,
          fontSize: 20,
          fontWeight: 'bold',
          fill: am5.color(0xffffff),
          paddingTop: 14,
          paddingLeft: 16,
          paddingRight: 16,
        });

        return am5.Bullet.new(root, {
          sprite: secondaryLabel,
          locationX: 0,
        });
      });

      pointSeries.data.setAll(MAINCITIES);
      secondaryPointSeries.data.setAll(CITIES);

      // for (var i = 0; i < cities.length; i++) {
      //   var city = cities[i];
      //   addCity(city.long, city.lat, city.title, city.name);
      // }

      // function addCity(long: number, lat: number, title: any, name: any) {
      //   pointSeries.data.push({
      //     geometry: { type: 'Point', coordinates: [long, lat] },
      //     title: title,
      //     name: name,
      //   });
      // }

      //  Make stuff animate on load
      pointSeries.appear(3000);
      chart.appear(1000, 100);
    });
  }

  showPopUp(X: number, Y: number, cityName: any): void {
    console.log('hello');
  }

  ngOnDestroy() {
    // Clean up chart when the component is removed
    this.browserOnly(() => {
      if (this.root) {
        this.root.dispose();
      }
    });
  }
}
