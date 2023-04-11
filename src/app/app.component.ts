import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TableViewComponent } from './table-view/table-view.component';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'NearBy';
  map: any;
  service: any;
  markers: any[] = [];
  searchValue: string = "Irvine";

  resourcetypes = [
    { key: "restaurant", value: 'Restaurant' },
    { key: "bar", value: 'Bar' },
    { key: "cafe", value: 'Cafe' },
    { key: "lodging", value: 'Lodging' },
    { key: "shopping_mall", value: 'Shopping Mall' },
    { key: "gym", value: 'Gym' },
    { key: "park", value: 'Park' },
    { key: "movie_theater", value: 'Movie Theater' },
    { key: "museum", value: 'Museum' },
    { key: "library", value: 'Library' },
    { key: "church", value: 'Church' },
    { key: "mosque", value: 'Mosque' },
    { key: "synagogue", value: 'Synagogue' },
    { key: "hindu_temple", value: 'Hindu Temple' },
    { key: "hospital", value: 'Hospital' },
    { key: "school", value: 'School' }    
  ];
  resourcetype: any = "restaurant";
  radius: any = 5000;
  selectedLocation: any = null;
  items:any = [];
  

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    const autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      { types: ['geocode'] }
    );
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();      
      this.searchValue = place.name;
      this.selectedLocation = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()};           
    });

    this.initMap();
  }

  getResourceType() {
    let type:any = this.resourcetypes.find(x=> x.key == this.resourcetype);  
    if(this.resourcetype == "library")  {
      return "Libraries";
    }
    return ["library", "church"].includes(type.key) ? type?.value + "es" : type?.value + "s";
  }

  initMap() {
    
    if (!this.selectedLocation) {
        this.selectedLocation = {lat: 33.6845673,lng: -117.8265049};
     }
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: this.selectedLocation.lat, lng: this.selectedLocation.lng},
      zoom: 14
    });

    this.service = new google.maps.places.PlacesService(this.map);
    this.search();
  }

  search() {
    if (!this.radius) {
      this.radius = 5000;
    }

    if (!this.resourcetype) {
      this.resourcetype = "restaurant"
    }

    if (!this.selectedLocation) {
        this.selectedLocation = {lat: 33.6845673,lng: -117.8265049};
    }

    const request = {
      location: this.selectedLocation,      
      radius: this.radius,
      type: this.resourcetype
    };

    this.service.nearbySearch(request, (results: any, status: any) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.clearMarkers();
        this.addMarkers(results);          
          if (results.length > 0) {
            const firstResult = results[0];
            const firstResultLocation = firstResult.geometry.location;
            this.map.panTo(firstResultLocation);
          }
      } else {
        this.items = []; 
        this.clearMarkers();
        this.cdr.detectChanges();
      }
    });
  }

  addMarkers(places: any[]) {
    this.items = [];      
    places.forEach((place) => {
      const marker = new google.maps.Marker({
        map: this.map,
        position: place.geometry.location
      });      
      this.items.push({name: place.name, status: place.business_status, rating: place.rating ? place.rating + ' (' + place.user_ratings_total+ ')' : '' , vicinity: place.vicinity});
      this.markers.push(marker);
    });

    this.cdr.detectChanges();
  }

  clearMarkers() {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });

    this.markers = [];
  }
}

