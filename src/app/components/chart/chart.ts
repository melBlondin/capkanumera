import {
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  Inject,
  NgZone,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { COORDINATES } from '../../core/constantes/coordinates';
import { MAINCITIES } from '../../core/constantes/main-cities';
import { CITIES } from '../../core/constantes/secondary-cities';
import { CURRENTCOORDINATES } from '../../core/constantes/curent-coordinate';

// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import { PopupService } from '../services/popup-services';
import { eventocalisationGroup } from '../../core/interfaces/popup-interface';
import test from 'node:test';
import { getShadowRoot } from '@amcharts/amcharts5/.internal/core/util/Utils';
import { popNumber } from 'rxjs/internal/util/args';
import { consumerBeforeComputation } from '@angular/core/primitives/signals';
import { coordinates } from '../../core/interfaces/coordinates';
import { map } from '@amcharts/amcharts5/.internal/core/util/Array';
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
  showPopUpRequest: boolean = true;
  popupService = inject(PopupService);
  eventLocalisation?: eventocalisationGroup;
  activeCityLocalisation: Array<eventocalisationGroup> = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    @Inject(ElementRef) private readonly elementRef: ElementRef,
    @Inject(DOCUMENT) private readonly documentRef: Document,
  ) {}

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
        }),
      );

      chart.set(
        'background',
        am5.RoundedRectangle.new(root, {
          fill: am5.color(0x03224c),
        }),
      );

      // Create polygon series
      var polygonSeries = chart.series.push(
        am5map.MapPolygonSeries.new(root, {
          geoJSON: am5geodata_worldLow,
          exclude: ['AQ'],
        }),
      );

      //Put the countries background  in grey color
      polygonSeries.mapPolygons.template.setAll({
        fill: am5.color(0xdadada),
      });

      // Create point series for Main cities
      var pointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
        }),
      );

      var popup = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
          name: 'city',
          tooltip: am5.Tooltip.new(root, {
            labelHTML: '<strong>{title}</strong><br>{comment} ',
          }),
        }),
      );

      let activeCityData: any[] = [];

      // Create regular bullets for main cities
      pointSeries.bullets.push(function () {
        var circle = am5.Circle.new(root, {
          radius: 11,
          fill: am5.color(0xf00020),
          fillOpacity: 0.75,
          cursorOverStyle: 'pointer',
        });

        //Adding popup display on click
        //console.log(pointSeries.dataItems); montre le tableau pointSeries
        //animation lors du clic sur ville principale

        /* circle.events.on('click', (e) => {
          if (e.target.dataItem) {
            //&& activeCityData.length == 0)

            var cible: any = e.target.dataItem.dataContext;
            var city: string = cible.name;
            var long: number = cible.long;
            var lat: number = cible.lat;
            var title: string = cible.title;
            var comment: string = cible.comment;
            var requestStatus: boolean = cible.requestStatus;
             var Xposition = e.point.x;
            var Yposition = e.point.y;
            activeCityData = [Xposition, Yposition, city];

            popup.data.setAll([
              {
                long,
                lat,
                city,
                comment,
                requestStatus,
                title,
                pictureSettings: {
                  src: city + '.jpg',
                },
              },
            ]);
          } else if (e.target.dataItem && activeCityData.length > 0) {
            popup.data.setAll([]);
            activeCityData = [];
          }
        });*/

        return am5.Bullet.new(root, {
          sprite: circle,
        });
      });

      // Create point series for  secondary cities et  ajout des popup
      var secondaryPointSeries = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
          // tooltip: am5.Tooltip.new(root, {
          //   labelHTML: '<strong>{name}</strong> ',
          // }),
        }),
      );

      // Create regular bullets for secondary cities
      secondaryPointSeries.bullets.push(function () {
        var secondaryCircle = am5.Circle.new(root, {
          radius: 6,
          tooltipY: 0,
          fill: am5.color(0x120228),
          fillOpacity: 0.75,
          cursorOverStyle: 'pointer',

          //tooltipText: '{}',
        });

        //Popup sur ville secondaire
        /*secondaryCircle.events.on('click', function (e) {
          if (e.target.dataItem) {
            //&& activeCityData.length == 0)

            var cible: any = e.target.dataItem.dataContext;
            var city: string = cible.name;
            var long: number = cible.long;
            var lat: number = cible.lat;
            var title: string = cible.title;
            var comment: string = cible.comment;
            var requestStatus: boolean = cible.requestStatus;
            commentWindow.push(city, title, comment);
          }
          console.log(commentWindow);

          var bulletContainer = am5.Container.new(root, {
            width: 500,
            height: 500,
            x: am5.percent(80),
            y: am5.percent(10),
            centerX: am5.percent(50),

            layout: root.verticalLayout,

            background: am5.RoundedRectangle.new(root, {
              fill: am5.color(0xffffff),
              fillOpacity: 1,
            }),
            verticalScrollbar: am5.Scrollbar.new(root, {
              orientation: 'vertical',
            }),
          });

          // Add an HTML-enabled title

          let label = bulletContainer.children.push(
            am5.Label.new(root, {
              html: '<div style="text-align: center;"><p style="font-size: 20px;">{popupCityName}</p></div>',
              x: am5.percent(50),
              y: am5.percent(0),
              width: 500,

              fill: am5.color(0xffffff),
              fillOpacity: 1,
              centerX: am5.percent(50),
              paddingTop: 10,
              paddingBottom: 10,
            }),
          );
          label.set(
            'background',
            am5.RoundedRectangle.new(root, {
              fill: am5.color(0xf00020),
              width: 500,

              cornerRadiusBL: 3,
              cornerRadiusBR: 3,
              cornerRadiusTL: 3,
              cornerRadiusTR: 3,
            }),
          );

          let textContainer = bulletContainer.children.push(
            am5.Container.new(root, {
              width: 500,
              height: 200,
              layout: am5.GridLayout.new(root, {
                maxColumns: 2,
                fixedWidthGrid: true,
              }),
              //x: am5.percent(80),
              //y: am5.percent(10),
              // centerX: am5.percent(50),

              //background: am5.RoundedRectangle.new(root, {
              //fill: am5.color(0xffffff),
              //fillOpacity: 1,
              //}),
              verticalScrollbar: am5.Scrollbar.new(root, {
                orientation: 'vertical',
              }),
            }),
          );

          let text = textContainer.children.push(
            am5.Label.new(root, {
              html: '<div style="text-align: center;"><p style="font-size: 12px;">{popUpTitle}</p></div>',
              x: am5.percent(50),
              y: am5.percent(0),
              fill: am5.color(0xffffff),
              fillOpacity: 1,
              //centerX: am5.percent(50),
              paddingTop: 10,
              paddingBottom: 10,
            }),
          );

          text.set(
            'background',
            am5.RoundedRectangle.new(root, {
              fill: am5.color(0x0080ff),
              cornerRadiusBL: 3,
              cornerRadiusBR: 3,
              cornerRadiusTL: 3,
              cornerRadiusTR: 3,
            }),
          );

          let imageContainer = textContainer.children.push(
            am5.Container.new(root, {
              html: '<div style="text-align: center;"><img src=\"CALP.jpeg\" width=\"100\" /><p style="font-size: 12px;">{popUpText}</p></div>',
            }),
          );

          -RECAP: il faut creer une série popup et lui faire un popup.data.setAll([{
  popupCityname: commentWindox.name,
  popupText: commentWindow.text
   popupTitle: commentWindow.title
 
}])

          //A VERIFIER NE FONCTIONNE PAS
          let image = textContainer.children.push(
            am5.Picture.new(root, {
              templateField: 'pictureSettings',
              //x: am5.percent(0),
              //y: am5.percent(0),
              width: 300,
              height: 300,
            }),
          );

          chart.children.push(bulletContainer);

          return am5.Bullet.new(root, {
            sprite: bulletContainer,
          });
        });*/

        return am5.Bullet.new(root, {
          sprite: secondaryCircle,
        });
      });

      //var commentWindow: any[] = [];

      // Create the initial animation
      var initialAnimatedBullet = chart.series.push(am5map.MapPointSeries.new(root, {}));

      initialAnimatedBullet.bullets.push(function () {
        var initialAnimatedBulletCircle = am5.Circle.new(root, {
          radius: 18,
          tooltipY: 0,
          fill: am5.color(0xf00020),
          fillOpacity: 0.75,
          //tooltipText: '{}',
        });

        initialAnimatedBulletCircle.animate({
          key: 'radius',
          from: 1,
          to: 20,
          duration: 1000,
          easing: am5.ease.out(am5.ease.cubic),
          loops: Infinity,
        });

        return am5.Bullet.new(root, {
          sprite: initialAnimatedBulletCircle,
        });
      });

      // Setting the current data cordinate
      var currentCoordinates = CURRENTCOORDINATES;
      console.log(CURRENTCOORDINATES[0].lat);
      console.log(currentCoordinates);
      initialAnimatedBullet.data.setAll([
        {
          geometry: {
            type: 'Point',
            coordinates: [CURRENTCOORDINATES[0].long, CURRENTCOORDINATES[0].lat],
          },
        },
      ]);
      // Create the temporary animation
      var temporaryAnimatedBullet = chart.series.push(am5map.MapPointSeries.new(root, {}));

      //ajout label villes principales
      pointSeries.bullets.push(function () {
        var label = am5.Label.new(root, {
          populateText: true, //permet de lire les variables des data sinon lit en mode "string"
          text: '{name}',
          centerX: am5.p0,
          centerY: 0,
          fontSize: 15,
          fontWeight: 'bold',
          fill: am5.color(0xffffff),
          paddingTop: 8,
          paddingLeft: 28,
          paddingRight: 8,
        });

        label.set(
          'background',
          am5.RoundedRectangle.new(root, {
            fill: am5.color(0xf00020),
            fillOpacity: 0.85,
            cornerRadiusBL: 3,
            cornerRadiusBR: 3,
            cornerRadiusTL: 3,
            cornerRadiusTR: 3,
          }),
        );

        return am5.Bullet.new(root, {
          sprite: label,
          locationX: 0,
        });
      });

      //ajout labels villes secondaires
      secondaryPointSeries.bullets.push(function () {
        var label = am5.Label.new(root, {
          populateText: true, //permet de lire les variables des data sinon lit en mode "string"
          text: '{name}',
          centerX: am5.p100,
          centerY: am5.p50,
          fontSize: 11,
          fill: am5.color(0x03224c),
          paddingTop: 2,
          paddingLeft: 10,
          paddingRight: 16,
        });

        label.set(
          'background',
          am5.RoundedRectangle.new(root, {
            cornerRadiusBL: 3,
            cornerRadiusBR: 3,
            cornerRadiusTL: 3,
            cornerRadiusTR: 3,
          }),
        );

        return am5.Bullet.new(root, {
          sprite: label,
          locationX: 0,
        });
      });
      //ajout bulle villes principales

      pointSeries.data.setAll(MAINCITIES);
      secondaryPointSeries.data.setAll(CITIES);

      //Create table of coordinates
      const coord: Array<[number, number]> = [];
      COORDINATES.forEach((city) => {
        coord.push([city.long, city.lat]);
      });

      // Create line series
      var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
      lineSeries.data.setAll([
        {
          geometry: {
            type: 'LineString',
            coordinates: coord,
          },
        },
      ]);

      lineSeries.mapLines.template.setAll({
        stroke: am5.color(0xdaa520),
        strokeWidth: 5,
        strokeOpacity: 0.5,
      });

      //Zooming to the starting point
      chart.events.on('click', function () {
        // changed from locationChart.events.on(...
        chart.zoomToGeoPoint(
          {
            longitude: CURRENTCOORDINATES[0].long,
            latitude: CURRENTCOORDINATES[0].lat,
          },
          32,
        );
        pointSeries.appear();
        secondaryPointSeries.appear();
        lineSeries.appear();
        initialAnimatedBullet.hide();

        //Creation of the Current position plot
        temporaryAnimatedBullet.bullets.push(function () {
          var temporaryAnimatedBulletCircle = am5.Circle.new(root, {
            radius: 15,
            tooltipY: 0,
            fill: am5.color(0xffffff),
            fillOpacity: 0.75,
            //tooltipText: '{}',
          });

          temporaryAnimatedBulletCircle.animate({
            key: 'radius',
            from: 1,
            to: 8,
            duration: 1000,
            easing: am5.ease.out(am5.ease.cubic),
            loops: 15,
          });

          return am5.Bullet.new(root, {
            sprite: temporaryAnimatedBulletCircle,
          });
        });

        temporaryAnimatedBullet.data.setAll([
          {
            geometry: {
              type: 'Point',
              coordinates: [CURRENTCOORDINATES[0].long, CURRENTCOORDINATES[0].lat],
            },
          },
        ]);
      });

      //  Make stuff animate on load
      pointSeries.hide();
      secondaryPointSeries.hide();
      lineSeries.hide();

      /* var pointSeriesWithoutLabels = chart.series.push(
        am5map.MapPointSeries.new(root, {
          latitudeField: 'lat',
          longitudeField: 'long',
        }),
      );
      pointSeriesWithoutLabels.bullets.push(function () {
        var tertiaryCircle = am5.Circle.new(root, {
          radius: 6,
          tooltipY: 0,
          fill: am5.color(0x120228),
          fillOpacity: 0.75,
          cursorOverStyle: 'pointer',
        });

        return am5.Bullet.new(root, {
          sprite: tertiaryCircle,
        });
      });

      pointSeriesWithoutLabels.data.setAll(COORDINATES);*/

      //chart.appear(1000, 100);
      chart.events.on('wheel', function () {
        var zoomLevel = chart.get('zoomLevel');
        if (zoomLevel) {
          if (zoomLevel < 18) {
            secondaryPointSeries.hide();
            //pointSeriesWithoutLabels.appear();
          } else {
            secondaryPointSeries.appear();
            //pointSeriesWithoutLabels.hide();
          }
          if (zoomLevel < 8) {
            pointSeries.hide();
            lineSeries.hide();
            temporaryAnimatedBullet.hide();
          } else {
            pointSeries.appear();
            lineSeries.appear();
            temporaryAnimatedBullet.appear();
          }
        }
      });
    });
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
