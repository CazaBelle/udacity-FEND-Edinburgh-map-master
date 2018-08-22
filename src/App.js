import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import FilterLocations from './FilterLocations';
import ErrorBoundary from './ErrorBoundary';
import escapeRegExp from 'escape-string-regexp';

//To disable ESLint from https://github.com/tomchentw/react-google-maps/issues/434 
/*global google*/

//handle potential problems Google Maps API keys
window.gm_authFailure = function() {
  alert("Oops, something went wrong! Please try again.")
}

class App extends Component {
  state = {
    map:'',
    markers:[],
    query:'',
    whiskeyPubs: [],
    searchedPubs: [],
    searchedMarkers: []
  }

//Get info from FourSqaure API
  getInfo = () => {
    const latlng = "55.953252, -3.2188267"
    const client_id = "GXAK0ZVGLU0Z3LO0NSAON2VUTOZTMLYUYIIE1KHAX0320ILL"
    const client_secret = "GOM3R1HYYQ1EASC0VUYONLJ1DHQQDSVJ51X5EGSRMIPXD2R0"
    const v = "20181408"
    const category = "4bf58dd8d48988d122941735"
    const max = 25
    const rad = 2000

    fetch(`https://api.foursquare.com/v2/venues/search?ll=${latlng}&client_id=${client_id}&client_secret=${client_secret}&v=${v}&categoryId=${category}&radius=${rad}&limit=${max}`)
          .then(function(response) { return response.json() })
          .then(data => {
              this.setState({ whiskeyPubs: data.response.venues,
                              searchedPubs: data.response.venues},
                              () => this.setMarkers())

          })
          .catch(function(error) { console.log(error) }) 
                              
        }
  
  componentDidMount() {
    window.initMap = this.initMap
      loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA&callback=initMap')
        this.getInfo()  
    }
  
  //create the map 
  initMap = () => {
    const map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 55.953252, lng: -3.2188267},
      zoom: 14
  })
  this.setState({map}, () => this.setMarkers())

}

setMarkers = () => {
  const {searchedPubs, map } = this.state
  const markers =[]
//animate markers 
  if (map && searchedPubs.length > 0 && markers.length === 0) {
    searchedPubs.forEach((venue, index) => {
      const marker = new google.maps.Marker({
        map: map, 
        position: venue.location,
        title: venue.name, 
        animation: window.google.maps.Animation.DROP, 
        id: index
      })

    marker.addListener('click', function() {
      if (marker.getAnimation() !== null) {
          marker.setAnimation(null)
      } else {
        marker.setAnimation(window.google.maps.Animation.BOUNCE)
        setTimeout(function() {
            marker.setAnimation(null)
          }, 100)
        }
    })
    marker.addListener('click', function(){
      fillInfoWindow(this, mapInfoWindow)
    })
    markers.push(marker)
  })

  const mapInfoWindow = new google.maps.InfoWindow()

  function fillInfoWindow (marker, infowindow) {
    const infoWindowContent = `<h4>${marker.title}</h4>`

    if (infowindow.marker !== marker) {
        infowindow.marker = marker 
        infowindow.setContent(infoWindowContent)
        infowindow.open(map, marker)
        //clear marker when closed
        infowindow.addListener('closeclick', function(){
          infowindow.setMarker = null
        })
    }
}
     this.setState({ markers })

  }
}
searchPubs = (query) => {
  this.setState({ query })
  const { markers, whiskeyPubs } = this.state
  if (query) {
    const match = new RegExp(escapeRegExp(query), 'i')
    markers.forEach((marker) => {
      marker.setVisible(false)
    })

    this.setState ({
        searchedPubs: whiskeyPubs.filter((whiskeyPubs) =>
        match.test(whiskeyPubs.name)),
        searchedMarkers: markers.filter((marker) => match.test(marker.title))
          .forEach((marker) => marker.setVisible(true))
    })
  } else {
    markers.map((marker) => marker.setVisible(true))
    this.setState({
      searchedPubs: whiskeyPubs,
      searchMarkers: markers
    })
  }
}

  render() {
    const { searchedPubs, markers, whiskeyPubs } = this.state
    return (
      <div className="app">
          <ErrorBoundary>
             <div>
             <Map />
               <FilterLocations
                  whiskeyPubs = {whiskeyPubs}
                  searchedPubs={searchedPubs}
                  markers={markers}
                  searchPubs={this.searchPubs.bind(this)}
               />
            
          </div>
        </ErrorBoundary>
        </div>

    )
  }
}

function loadJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");

  script.src = src;
  script.async = true;
  ref.parentNode.insertBefore(script, ref);

  script.onerror = function() {
      document.write("Load error. Google Maps")
  };
}

export default App;
