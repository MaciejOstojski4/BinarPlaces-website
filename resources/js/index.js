$(function() {

    const API_URL = "http://www.mocky.io/v2/";
    const CATEGORIES_PATH = "5a35174c2f00002a0ce251d2";
    const PLACES_PATH = "5a3786243200008600eb6963";

    var fetchCategories = function() {
        $.ajax({
            type: "GET",
            url: API_URL + CATEGORIES_PATH,
            success: function(res) {
                const $navbar = $(".navbar-list");
                addCategoriesToNavbar($navbar, res);
                addCssToNavbarElem($navbar);
                addOnClickToNavbarElem($navbar);
            },
            error: function(error) {
                console.log(error);
            }
        })
    };

    var addCategoriesToNavbar = function($navbar, categoryList) {
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
            fetchPlacesByCategoryId($(this).children().text());
            window.location = "#main-content";
        })
    };

    var fetchPlacesByCategoryId = function(categoryID) {
        $.ajax({
            type: "GET",
            url: API_URL + PLACES_PATH,
            success: function(res) {
                var places = res.filter(function(place) {
                    if(place.category_id == categoryID) {
                        return place;
                    }
                });
                console.log(places);
            },
            error: function(error) {
              console.log(error);
            }
      });
    };

    fetchCategories();
});