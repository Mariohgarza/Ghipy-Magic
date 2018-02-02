var onScreen = false;
var value;
var apiResponse = {};
var topics = ["funny", "diamonds", "babies", "planes", "predator", "soccer", "trump", "ferrari", "wow", "random"];

createButtons();

$("#usr").on("keyup change", function() {
    value = $("#usr").val().trim();; // omit "var" to make it global

});


$('button').on('click', onSearch);
$('#searchButton').on('click', function() {


  if (topics.indexOf(value) == -1) {
        topics.push(value);
        $('#newGif').append("<button id=" + value + " >" + value + "</button>");
        var onClick = function(index) {
            var j = topics.length-1;
            return function() {
                value = topics[j];
            };
        };
        $('#'+value).on('click', onClick());
        $('#'+value).on('click', onSearch);

  }

  onSearch();
});


function onSearch() {

    $("#usr").val("");

    if (onScreen) {
        $('#results').empty();
        onScreen = false;
    }

    // if (topics.indexOf(value) == -1) {
    //     topics.push(value);
    //     $('#newGif').append("<button id=" + value + " >" + value + "</button>");
    //     $('#'+value).on('click', onSearch);

    // }


    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + value +
        "&api_key=fe9SwUMw7Dpp1WP5FqZfMp3BfjBdjsPq&limit=10";



    $.ajax({
            url: queryURL,
            method: "GET"
        })
        .done(function(response) {
            apiResponse = response;

            var randomDiv = $('<div>');
            console.log(apiResponse);
            if (!onScreen) {
                onScreen = true;
                for (var l = 0; l < apiResponse.data.length; l++) {
                    var p = $('<p>').text("Rating:" + apiResponse.data[l].rating);
                    $('#results').append("<p> Rating: " + apiResponse.data[l].rating.toUpperCase() + "</p>");

                    $('#results').append(createGif(apiResponse.data[l].images, l));
                    var img_name = value + '_' + l;

                    var on_click = function(id) {
                        return function() {
                            var _id = id;
                            animateGif(_id);
                        }
                    };

                    $('#' + img_name).on('click', on_click(img_name));
                }
                value = "";

            }
        })
}


function createGif(imgs, nth) {
    var src_still = '"' + imgs.downsized_still.url + '" ';
    var src_anim = '"' + imgs.downsized.url + '" ';

    var tag = '<img id="' + value + '_' + nth + '" src=' + src_still + 'data-still=' + src_still + 'data-animate=' + src_anim + 'data-state="still" class="gif">';
    $('#results').append(tag);

}


function createButtons() {
    for (var i = 0; i < topics.length; i++) {
        $('#newGif').append("<button id=" + topics[i] + ">" + topics[i] + "</button>");
        var onClick = function(index) {
            var j = index;
            return function() {
                value = topics[j];
            };
        };
        $('#' + topics[i]).on('click', onClick(i));
    }
}

function animateGif(_id) {
    var id = "#" + _id;
    var state = $(id).attr("data-state");
    if (state === 'still') {
        $(id).attr("src", $(id).attr("data-animate"));
        $(id).attr("data-state", "animate");
    } else {
        $(id).attr("src", $(id).attr("data-still"));
        $(id).attr("data-state", "still");
    }
}