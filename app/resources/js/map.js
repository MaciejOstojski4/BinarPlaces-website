const map = (function() {

  const ROOT_URL = "http://taste-api.binarlab.com";

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
        content: prepareInfoWindowContent(place),
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
    const $infoContainer = $("<div>").addClass("map-marker-container");
    $("<h3>").text(place.name).appendTo($infoContainer);
    const $contentContainer = $("<div>").appendTo($infoContainer);
    $("<p>").text(place.location.address).appendTo($contentContainer);
    $("<p>").text("Ocena: " + (place.rate ? place.rate : "brak")).appendTo($contentContainer);
    const $imgContainer = $("<div>").addClass("map-marker-img-container").appendTo($contentContainer);
    $("<img>").attr("src", ROOT_URL + place.picture_url).addClass("map-marker-img").appendTo($imgContainer);
    return $infoContainer.get(0);
  };

  return {
    init: init,
  }
})();
