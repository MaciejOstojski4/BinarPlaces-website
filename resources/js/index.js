$(function() {

    const apiURL = "http://www.mocky.io/v2/5a35174c2f00002a0ce251d2";

    var fetchCategories = function() {
        $.ajax({
            type: "GET",
            url: apiURL,
            success: function(res) {
                const $navbar = $(".navbar-list");
                res.forEach(function(category) {
                    const liElem = '<li><a href="">'+ category.name +'</a></li>';
                    $navbar.append(liElem);
                });
                $navbar.children().addClass("navbar-list-element");
                $navbar.find("a").addClass("navbar-list-element-link");
            },
            error: function(error) {
                console.log(error);
            }
        })
    };

    fetchCategories();
});