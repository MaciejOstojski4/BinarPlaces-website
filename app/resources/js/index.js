let apiClient = (function() {

    const API_URL = "http://www.mocky.io/v2/";

    const CATEGORIES_PATH = "5a3e7f602f0000b714171398";
    const PLACES_PATH = "5a3786243200008600eb6963";
    const PLACE_REVIEWS = "5a425ea5300000f21a709ded";

    let fetchCategories = async function() {
        return await $.ajax({
            type: "GET",
            url: API_URL + CATEGORIES_PATH
        });
    };

    let fetchPlaces = async function(categoryID) {
        return await $.ajax({
            type: "GET",
            url: API_URL + PLACES_PATH,
        });
    };

    let fetchPlaceReviews = async function(placeID) {
        return await $.ajax({
            type: "GET",
            url: API_URL + PLACE_REVIEWS,
        });
    };

    return {
        fetchCategories: fetchCategories,
        fetchPlaces: fetchPlaces,
        fetchPlaceReviews: fetchPlaceReviews
    }
})();

let placesContainer = (function() {

    let CARDS_IN_ROW = 3;

    let categories = [];

    let setCategories = function(data) {
        categories = data;
    };

    let getCategories = function() {
        return categories;
    };

    let removeCardsWithPlaces = function() {
        let $placeContainer = $("#place-card-container");
        $placeContainer.children().remove();
        return $placeContainer;
    };

    let sortPlacesByRate = function(first, second) {
        if(first.location.rate > second.location.rate) {
            return -1;
        } else if(first.location.rate < second.location.rate) {
            return 1;
        } else {
            return 0;
        }
    };

    let prepareCardsWithPlaces = function($placeContainer, allPlaces, categoryID) {
        let places = _getPlacesByCategory(allPlaces, categoryID);
        let $row;
        places.forEach(function(place, index) {
            if((index % CARDS_IN_ROW) === 0) {
                $row = _createRowForCard($placeContainer);
            }
            const $column = _createColumnForCard($row);
            const $placeCard = _createPlaceCard($column);
            _addPlaceInfoToCard($placeCard, place);
        });
    };

    let _addPlaceInfoToCard = function($card, place) {
        const placeImgSrc = _resolveCardImgSrc(place.category_id);
        const category = _getCategoryById(place.category_id);
        $("<img>", {src: placeImgSrc, width: "100px", height: "100px"})
            .addClass("img-circle").appendTo($card);
        $("<h2>").text(place.name).appendTo($card);
        $("<small>").text(category.name).appendTo($card);
        $("<h4>").text(place.location.address).appendTo($card);
        _addRateHolder($card, place);
    };

    let _addRateHolder = function($card, place) {
        const $rateHolder = $('<div data-toggle="modal" data-target="#ratesModal">').appendTo($card);
        const $rates= $('<select id="rates">').appendTo($rateHolder);
        for(let i=0; i<5; i++) {
            $('<option value=' + (i+1) + '>').text(i+1).appendTo($rates);
        }
        $rates.barrating({
            theme: 'fontawesome-stars-o',
            initialRating: place.location.rate,
            readonly: true
        });
        $rateHolder.click(_displayPlaceReviews);
    };

    let _displayPlaceReviews = function(event) {
        apiClient.fetchPlaceReviews(1)
            .then(data => console.log(data))
            .catch(error => console.log(error))
    };

    let _resolveCardImgSrc = function(categoryID) {
        switch(categoryID) {
            case 1:
                return "resources/images/pizza-food.jpeg";
            case 2:
                return "resources/images/chinese-food.jpeg";
            case 3:
                return "resources/images/indian-food.jpeg";
            case 4:
                return "resources/images/cafe-food.jpeg";
            default:
                return "resources/images/default-food.jpeg";
        }
    };

    let _createRowForCard = function($container) {
        return $("<div/>").addClass("row").appendTo($container);
    };

    let _createColumnForCard = function($row) {
        return $("<div>").addClass("col-md-4").appendTo($row);
    };

    let _createPlaceCard = function($column) {
        return $("<div>").addClass("place-card text-center").appendTo($column);
    };

    let _getPlacesByCategory = function(places, categoryID) {
        if(categoryID == -1) {
            return places;
        }
        return places.filter(function(place) {
            if(place.category_id == categoryID) {
                return place;
            }
        });
    };

    let _getCategoryById = function(categoryID) {
        const category = categories.filter(function(c) {
            if(c.id == categoryID){
                return c;
            }
        });
        return category[0];
    };

    return {
        removeCardsWithPlaces: removeCardsWithPlaces,
        sortPlacesByRate: sortPlacesByRate,
        prepareCardsWithPlaces: prepareCardsWithPlaces,
        setCategories: setCategories,
        getCategories: getCategories,
    }
})();

let navbar = (function() {

    let CATEGORIES_IN_NAVBAR = 5;

    let _addCategoriesToNavbar = function($navbar) {
        _addDefaultCategory($navbar);
        _addMostPopularCategory($navbar);
        _addCategoryInDropdown($navbar);
    };

    let _addDefaultCategory = function($navbar) {
        const allPlacesCategory = '<li><a href=MAIN_CONTENT_ANCHOR><span>-1</span>Wszystkie</a></li>';
        $navbar.append(allPlacesCategory);
    };

    let _addMostPopularCategory = function($navbar) {
        for(let i=0; i<CATEGORIES_IN_NAVBAR; i++) {
            const category = placesContainer.getCategories()[i];
            const liElem = '<li><a href=MAIN_CONTENT_ANCHOR><span>'+category.id+'</span>'+ category.name +'</a></li>';
            $navbar.append(liElem);
        }
    };

    let _addCssToNavbarElem = function($navbar) {
        $navbar.children().addClass("navbar-list-element");
        $navbar.find("a").addClass("navbar-list-element-link");
        $navbar.find("span").addClass("hidden");
    };

    let _displayPlaces = function(data, categoryID) {
        var $placesContainer = placesContainer.removeCardsWithPlaces();
        const places = data.sort(placesContainer.sortPlacesByRate);
        placesContainer.prepareCardsWithPlaces($placesContainer, places, categoryID);
        $("#loader").hide();
        $("#content").show();
    };

    let _addOnClickToNavbarElem = function($navbar) {
        $navbar.find("li:not(last)").click(function(e) {
            e.preventDefault();
            $("#loader").show();
            const categoryID = $(this).find("span").text();
            apiClient.fetchPlaces(categoryID)
                .then(data => _displayPlaces(data, categoryID))
                .catch(error => console.log(error));
            window.location = "#main-content";
        })
    };

    let _addCategoryInDropdown = function($navbar) {
        const $selectLi = $('<li class="dropdown show"><a href="#" data-toggle="dropdown">Inne</a></li>');
        $navbar.append($selectLi);
        const $dropDownList = $("<div>").addClass("dropdown-menu navbar-dropdown-category").appendTo($selectLi);
        for(var j=CATEGORIES_IN_NAVBAR; j<placesContainer.getCategories().length; j++) {
            const category = placesContainer.getCategories()[j];
            const categoryOp = '<a href="MAIN_CONTENT_ANCHOR"><span>'+category.id+'</span>'+ category.name +'</a>';
            $dropDownList.append(categoryOp);
        }
    };

    let _sortCategoriesByCount = function(first, second) {
        if(first.count > second.count) {
            return -1;
        } else if(first.count < second.count) {
            return 1;
        } else {
            return 0;
        }
    };

    let prepareNavbar = function(data) {
        const categories = data.sort(_sortCategoriesByCount);
        placesContainer.setCategories(categories);
        const $navbar = $(".navbar-list");
        _addCategoriesToNavbar($navbar);
        _addCssToNavbarElem($navbar);
        _addOnClickToNavbarElem($navbar);
    };

    return {
        prepareNavbar: prepareNavbar
    }
})();

let app = (function() {

    let _setDateInFooter = function() {
        let date = new Date();
        $("#copyrightInfo").text("Copyright " + date.getFullYear());
    };

    let _hideElementOnStart = function() {
        $("#content").hide();
        $("#loader").hide();
    };

    let init = function() {
        _setDateInFooter();
        _hideElementOnStart();
        apiClient.fetchCategories()
            .then(data => navbar.prepareNavbar(data))
            .catch(error => console.log(error));
    };

    return {
        init: init,
    }
})();

$(function() {
    app.init();
});