const map = (function() {

  const init =  function() {
    var lodz = {lat: 51.759249, lng: 19.455983};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 10,
      center: lodz
    });
    const places = userSession.getObject("places");
    places.forEach(function(place) {
      const marker = new google.maps.Marker({
        position: {lat: parseInt(place.location.lat), lng: parseInt(place.location.lon)},
        map: map,
        title: place.name
      });
      const infowindow = new google.maps.InfoWindow({
        content: prepareInfoWindowContent(place)
      });
      marker.addListener("click", function() {
        infowindow.open(map, marker);
      })
    });

    google.maps.event.addListener(map, "idle", function() {
      google.maps.event.trigger(map, 'resize');
    });
  };

  const prepareInfoWindowContent = function(place) {
    return "<div><div><h3>" + place.name + "</h3></div>" +
      "<div><p>" + place.location.address + "</p></div>" +
      "<div><p>Ocena: " + (place.rate ? place.rate : "brak") + "</p></div></div>";
  };

  return {
    init: init,
  }
})();
