$(function() {
    $.ajax({
        type: "GET",
        url: "http://taste-api.binarlab.com/api/v1/categories",
        success: function(res) {
            console.log("sukces");
        },
        error: function(error) {
            console.log(error);
        }
    })
});