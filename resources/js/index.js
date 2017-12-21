$(function() {

    const API_URL = "http://www.mocky.io/v2/";
    const CATEGORIES_PATH = "5a35174c2f00002a0ce251d2";
    const PLACES_PATH = "5a3786243200008600eb6963";

    const CARDS_IN_ROW = 3;

    var categories = [];

    var init = function() {
        var date = new Date();
        $("#copyrightInfo").text("Copyright " + date.getFullYear());

        fetchCategories();
    };

    var fetchCategories = function() {
        $.ajax({
            type: "GET",
            url: API_URL + CATEGORIES_PATH,
            success: function(res) {
                categories = res;
                const $navbar = $(".navbar-list");
                addCategoriesToNavbar($navbar, categories);
                addCssToNavbarElem($navbar);
                addOnClickToNavbarElem($navbar);
            },
            error: function(error) {
                console.log(error);
            }
        })
    };

    var addCategoriesToNavbar = function($navbar, categoryList) {
        const allPlacesCategory = '<li><a href="#main-content"><span>-1</span>Wszystkie</a></li>';
        $navbar.append(allPlacesCategory);
        categoryList.forEach(function(category) {
            const liElem = '<li><a href="#main-content"><span>'+category.id+'</span>'+ category.name +'</a></li>';
            $navbar.append(liElem);
        });
    };

    var addCssToNavbarElem = function($navbar) {
        $navbar.children().addClass("navbar-list-element");
        $navbar.find("a").addClass("navbar-list-element-link");
        $navbar.find("span").addClass("hidden");
    };

    var addOnClickToNavbarElem = function($navbar) {
        $navbar.find("li").on("click", "*", function(e) {
            e.preventDefault();
            fetchPlaces($(this).children().text());
            window.location = "#main-content";
        })
    };

    var fetchPlaces = function(categoryID) {
        var $placesContainer = removeCardsWithPlaces();
        $.ajax({
            type: "GET",
            url: API_URL + PLACES_PATH,
            success: function(res) {
                prepareCardsWithPlaces($placesContainer, res, categoryID);
            },
            error: function(error) {
              console.log(error);
            }
      });
    };

    var prepareCardsWithPlaces = function($placeContainer, allPlaces, categoryID) {
        var places = getPlacesByCategory(allPlaces, categoryID);
        var $row;
        places.forEach(function(place, index) {
            if((index % CARDS_IN_ROW) === 0) {
                $row = createRowForCard($placeContainer);
            }
            const $column = createColumnForCard($row);
            const $placeCard = createPlaceCard($column);
            addPlaceInfoToCard($placeCard, place);
        });
    };

    var addPlaceInfoToCard = function($card, place) {
        const placeImgSrc = resolveCardImgSrc(place.category_id);
        const category = getCategoryById(place.category_id);
        $("<img>", {src: placeImgSrc, width: "100px", height: "100px"})
            .addClass("img-circle").appendTo($card);
        $("<h2>").text(place.name).appendTo($card);
        $("<small>").text(category.name).appendTo($card);
        $("<h4>").text(place.location.address).appendTo($card);
        $("<h4>").text("Ocena: " + place.location.rate).appendTo($card);
    };

    var resolveCardImgSrc = function(categoryID) {
        switch(categoryID) {
            case 1:
                return "images/pizza-food.jpeg";
            case 2:
                return "images/chinese-food.jpeg";
            case 3:
                return "images/indian-food.jpeg";
            case 4:
                return "images/cafe-food.jpeg";
            default:
                return "images/default-food.jpeg";
        }
    };

    var createRowForCard = function($container) {
        return $("<div/>").addClass("row").appendTo($container);
    };

    var createColumnForCard = function($row) {
        return $("<div>").addClass("col-md-4").appendTo($row);
    };

    var createPlaceCard = function($column) {
        return $("<div>").addClass("place-card text-center").appendTo($column);
    };

    var removeCardsWithPlaces = function() {
        var $placeContainer = $("#place-card-container");
        $placeContainer.children().remove();
        return $placeContainer;
    };

    var getPlacesByCategory = function(places, categoryID) {
        if(categoryID == -1) {
            return places;
        }
        return places.filter(function(place) {
            if(place.category_id == categoryID) {
                return place;
            }
        });
    };

    var getCategoryById = function(categoryID) {
        const category = categories.filter(function(cat) {
            if(cat.id == categoryID){
                return cat;
            }
        });
        return category[0];
    };

    init();
});