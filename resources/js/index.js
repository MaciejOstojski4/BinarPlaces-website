var apiClient = (function() {

    const API_URL = "http://www.mocky.io/v2/";

    const CATEGORIES_PATH = "5a3e7f602f0000b714171398";
    const PLACES_PATH = "5a3786243200008600eb6963";
    const PLACE_REVIEWS = "5a425ea5300000f21a709ded";

    var fetchCategories = async function() {
        const result = await $.ajax({
            type: "GET",
            url: API_URL + CATEGORIES_PATH
        });
        return result;
    };

    var fetchPlaces = async function(categoryID) {
        const result = await $.ajax({
            type: "GET",
            url: API_URL + PLACES_PATH,
        });
        return result
    };

    var fetchPlaceReviews = async function(placeID) {
        const result = await $.ajax({
            type: "GET",
            url: API_URL + PLACE_REVIEWS,
        });
        return result;
    };

    return {
        fetchCategories: fetchCategories,
        fetchPlaces: fetchPlaces,
        fetchPlaceReviews: fetchPlaceReviews
    }
})();

var app = (function() {

    var CARDS_IN_ROW = 3;
    var CATEGORIES_IN_NAVBAR = 5;

    var categories = [];

    var _setDateInFooter = function() {
        var date = new Date();
        $("#copyrightInfo").text("Copyright " + date.getFullYear());
    };

    var _hideElementOnStart = function() {
        $("#content").hide();
        $("#loader").hide();
    };

    var _addCategoriesToNavbar = function($navbar) {
        _addDefaultCategory($navbar);
        _addMostPopularCategory($navbar);
        _addCategoryInDropdown($navbar);
    };

    var _addDefaultCategory = function($navbar) {
        const allPlacesCategory = '<li><a href=MAIN_CONTENT_ANCHOR><span>-1</span>Wszystkie</a></li>';
        $navbar.append(allPlacesCategory);
    };

    var _addMostPopularCategory = function($navbar) {
        for(var i=0; i<CATEGORIES_IN_NAVBAR; i++) {
            const category = categories[i];
            const liElem = '<li><a href=MAIN_CONTENT_ANCHOR><span>'+category.id+'</span>'+ category.name +'</a></li>';
            $navbar.append(liElem);
        }
    };

    var _addCssToNavbarElem = function($navbar) {
        $navbar.children().addClass("navbar-list-element");
        $navbar.find("a").addClass("navbar-list-element-link");
        $navbar.find("span").addClass("hidden");
    };

    var _removeCardsWithPlaces = function() {
        var $placeContainer = $("#place-card-container");
        $placeContainer.children().remove();
        return $placeContainer;
    };

    var _sortPlacesByRate = function(first, second) {
        if(first.location.rate > second.location.rate) {
            return -1;
        } else if(first.location.rate < second.location.rate) {
            return 1;
        } else {
            return 0;
        }
    };

    var _prepareCardsWithPlaces = function($placeContainer, allPlaces, categoryID) {
        var places = _getPlacesByCategory(allPlaces, categoryID);
        var $row;
        console.log(places);
        places.forEach(function(place, index) {
            if((index % CARDS_IN_ROW) === 0) {
                $row = _createRowForCard($placeContainer);
            }
            const $column = _createColumnForCard($row);
            const $placeCard = _createPlaceCard($column);
            _addPlaceInfoToCard($placeCard, place);
        });
    };

    var _addPlaceInfoToCard = function($card, place) {
        const placeImgSrc = _resolveCardImgSrc(place.category_id);
        const category = _getCategoryById(place.category_id);
        $("<img>", {src: placeImgSrc, width: "100px", height: "100px"})
            .addClass("img-circle").appendTo($card);
        $("<h2>").text(place.name).appendTo($card);
        $("<small>").text(category.name).appendTo($card);
        $("<h4>").text(place.location.address).appendTo($card);
        _addRateHolder($card, place);
    };

    var _addRateHolder = function($card, place) {
        const $rateHolder = $('<div data-toggle="modal" data-target="#ratesModal">').appendTo($card);
        const $rates= $('<select id="rates">').appendTo($rateHolder);
        for(var i=0; i<5; i++) {
            $('<option value=' + (i+1) + '>').text(i+1).appendTo($rates);
        }
        $rates.barrating({
            theme: 'fontawesome-stars-o',
            initialRating: place.location.rate,
            readonly: true
        });
        $rateHolder.click(_displayPlaceReviews);
    };

    var _displayPlaceReviews = function(event) {
        console.log("tegotego");
        apiClient.fetchPlaceReviews(1).then(data => {
            console.log(data);
        })
    };

    var _addOnClickToNavbarElem = function($navbar) {
        $navbar.find("li:not(last)").click(function(e) {
            e.preventDefault();
            $("#loader").show();
            const categoryID = $(this).find("span").text();
            apiClient.fetchPlaces(categoryID).then(data => {
                var $placesContainer = _removeCardsWithPlaces();
                const places = data.sort(_sortPlacesByRate);
                _prepareCardsWithPlaces($placesContainer, places, categoryID);
                $("#loader").hide();
                $("#content").show();
            });
            window.location = "#main-content";
        })
    };

    var _addCategoryInDropdown = function($navbar) {
        const $selectLi = $('<li class="dropdown show"><a href="#" data-toggle="dropdown">Inne</a></li>');
        $navbar.append($selectLi);
        const $dropDownList = $("<div>").addClass("dropdown-menu navbar-dropdown-category").appendTo($selectLi);
        for(var j=CATEGORIES_IN_NAVBAR; j<categories.length; j++) {
            const category = categories[j];
            const categoryOp = '<a href="MAIN_CONTENT_ANCHOR"><span>'+category.id+'</span>'+ category.name +'</a>';
            $dropDownList.append(categoryOp);
        }
    };

    var _sortCategoriesByCount = function(first, second) {
        if(first.count > second.count) {
            return -1;
        } else if(first.count < second.count) {
            return 1;
        } else {
            return 0;
        }
    };

    var _resolveCardImgSrc = function(categoryID) {
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

    var _createRowForCard = function($container) {
        return $("<div/>").addClass("row").appendTo($container);
    };

    var _createColumnForCard = function($row) {
        return $("<div>").addClass("col-md-4").appendTo($row);
    };

    var _createPlaceCard = function($column) {
        return $("<div>").addClass("place-card text-center").appendTo($column);
    };

    var _getPlacesByCategory = function(places, categoryID) {
        if(categoryID == -1) {
            return places;
        }
        return places.filter(function(place) {
            if(place.category_id == categoryID) {
                return place;
            }
        });
    };

    var _getCategoryById = function(categoryID) {
        const category = categories.filter(function(cat) {
            if(cat.id == categoryID){
                return cat;
            }
        });
        return category[0];
    };


    var init = function() {
        _setDateInFooter();
        _hideElementOnStart();
        apiClient.fetchCategories().then(data => {
            categories = data.sort(_sortCategoriesByCount);
            const $navbar = $(".navbar-list");
            _addCategoriesToNavbar($navbar);
            _addCssToNavbarElem($navbar);
            _addOnClickToNavbarElem($navbar);
        })
    };

    return {
        init: init,
    }
})();

$(function() {
    app.init();
});