$(document).ready(function () {

    var topic = ["apples", "bananas", "avocados", "bread"];

    var queryTopic = "";
    var queryApiKey = "k4lIc25Cnm8PVmdTTePqX37D2HFooSyY";
    var queryURL = "https://api.giphy.com/v1/gifs/search?";
    var queryString = "";

    var topicGifs = [];
    var activeGif = "";
    var offsetNumber = 0;

    var favGifs = [];

    // var nutritionTopic = activeGif;
    // var nutritionApiKey = "ef1557de06mshdcf3099eaace12dp128ffejsn390f022c636c";
    // var nutritionURL = "https://nutritionix-api.p.rapidapi.com/v1_1/search/";
    // var nutritionString = "";

    for (var i = 0; i < topic.length; i++) {
        generateButton(topic[i]);
    };

    $.ajax({
        url: "https://api.giphy.com/v1/gifs/26xBJJEETvqGHxVIc?api_key=k4lIc25Cnm8PVmdTTePqX37D2HFooSyY",
        method: "GET"
    }).then(function (response) {
        $("#letter-g").attr("src", response.data.images.fixed_height_small.url)
    });

    $.ajax({
        url: "https://api.giphy.com/v1/gifs/l3q2GccupHgLPBqZG?api_key=k4lIc25Cnm8PVmdTTePqX37D2HFooSyY",
        method: "GET"
    }).then(function (response) {
        $("#letter-i").attr("src", response.data.images.fixed_height_small.url)
    });

    $.ajax({
        url: "https://api.giphy.com/v1/gifs/l3q2PG0N4D2kUua3e?api_key=k4lIc25Cnm8PVmdTTePqX37D2HFooSyY",
        method: "GET"
    }).then(function (response) {
        $("#letter-f").attr("src", response.data.images.fixed_height_small.url)
    });

    $.ajax({
        url: "https://api.giphy.com/v1/gifs/d3mmB85lPiyE5jvq?api_key=k4lIc25Cnm8PVmdTTePqX37D2HFooSyY",
        method: "GET"
    }).then(function (response) {
        $("#letter-s").attr("src", response.data.images.fixed_height_small.url)
    });

    $("#button-group").on("click", ".btn", function () {
        $("#more-gifs").show();
        offsetNumber = 0;
        clearGifs();
        topicGifs = [];
        activeGif = $(this).text();
        queryTopic = $(this).text();
        generateURL(queryTopic, offsetNumber);
        getGifs(queryString);
    });

    $("#gif-gallery").on("click", ".gif", function () {
        var gifValue = $(this).data("value");
        var gifMoving = $(this).data("moving");
        if (gifMoving === "off") {
            $(this).data("moving", "on");
            $(this).attr("src", topicGifs[gifValue].images.fixed_height.url);
        } else if (gifMoving === "on") {
            $(this).data("moving", "off");
            $(this).attr("src", topicGifs[gifValue].images.fixed_height_still.url);
        };
    });

    $("#user-submit").on("click", function () {
        event.preventDefault();
        var searchedWord = $("#user-input").val().trim();
        if (searchedWord === "") {
            $(".modal").modal("show");
        } else {
            topicGifs.push(searchedWord);
            generateButton(searchedWord);
            $("#user-input").val("");
        };
    });

    $("#more-gifs").on("click", function () {
        event.preventDefault();
        generateURL(activeGif, offsetNumber);
        getGifs(queryString);
    });

    $("#gif-gallery").on("click", "#fav", function () {
        var favValue = $(this).data("fav")
        var dataValue = $(this).data("value");
        var gifIdValue = $(this).data("id");
        console.log(gifIdValue);
        if (favValue === false) {
            $(this).removeClass("far").addClass("fas");
            $(this).data("fav", true);
            topicGifs[dataValue].favorite = true;
            favGifs.push(topicGifs[dataValue]);
            console.log(favGifs);
        } else {
            $(this).removeClass("fas").addClass("far");
            $(this).data("fav", false);
            topicGifs[dataValue].favorite = false;
            for (var l = 0; l < favGifs.length; l++) {
                if (favGifs[l].id === gifIdValue) {
                    favGifs.splice(l, 1);
                };
            };
            console.log(favGifs);
        };
    });

    $("#fav-gifs").on("click", function () {
        event.preventDefault();
        clearGifs();
        generateGif(0, favGifs);
    });

    function generateButton(str) {
        var newButton = $("<button>").text(str);
        newButton.addClass("btn btn-primary btn-sm");
        $("#button-group").append(newButton);
    };

    function generateURL(str, num) {
        return queryString = queryURL + "api_key=" + queryApiKey + "&" + "q=" + str + "&" + "limit=10" + "&" + "offset=" + num;
    };

    // function generateNutritionURL(str) {
    //     return nutritionString = nutritionURL + nutritionTopic + "&" + "api_key=" + nutritionApiKey;
    // }

    function getGifs(str) {
        $.ajax({
            url: str,
            method: "GET"
        }).then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                response.data[j].favorite = false;
                topicGifs.push(response.data[j]);
            };
            generateGif(offsetNumber, topicGifs);
            offsetNumber += 10;
            console.log(topicGifs);
        });
    };

    function generateGif(num, arr) {
        var index = num + 10;
        for (var k = num; k < index; k++) {
            var imageContainer = $("<figure>").addClass("figure");
            var imageGif = $("<img>").attr("src", arr[k].images.fixed_height_still.url);
            imageGif.addClass("gif figure-img img-fluid rounded");
            imageGif.attr("alt", arr[k].title);
            imageGif.attr("data-value", k);
            imageGif.attr("data-moving", "off");
            var imageFav = $("<figcaption>");
            var imageText = '<i id="fav" class="far fa-star float-right" data-fav="false" data-value=' + k + ' data-id=' + arr[k].id + '></i>';
            imageFav.html(imageText);
            var imageRating = $("<figcaption>");
            var ratingText = "Rated: " + arr[k].rating.toUpperCase();
            imageRating.text(ratingText);
            imageRating.addClass("figure-caption text-left");
            var imageTitle = $("<figcaption>");
            var titleText = arr[k].title.italics();
            imageTitle.html(titleText);
            imageTitle.addClass("figure-caption text-left");
            $(imageContainer).append(imageGif);
            $(imageContainer).append(imageFav);
            $(imageContainer).append(imageRating);
            $(imageContainer).append(imageTitle);
            $("#gif-gallery").append(imageContainer);
        };
    };

    function clearGifs() {
        $("#gif-gallery").empty();
    };

});