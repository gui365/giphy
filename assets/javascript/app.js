var giphy = {
  apiKey: "6TOJn9Z285U9hfH7TGvprMzuhQhzncPw",
  topics: ["Monica Geller", "Ross Geller", "Phoebe Buffey", "Joey Tribbiani", "Rachel Green", "Chandler Bing", "Janice Hosenstein"],
  // User's custom keyword
  keyword: "",
  numberImages: "10",
  imageIndex: 0,
  responseSaved: "",
  
  // AJAX request to Giphy API using the keywords of the array
  request() {
    giphy.keyword = ($(this).attr("data-keyword"));
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?q=" + giphy.keyword + "+friends+tv&api_key=" + giphy.apiKey + "&limit=50",
        method: "GET"
      }).then(function(response){
        giphy.generateImages(response);
        giphy.responseSaved = JSON.stringify(response);
        // console.log(response);
        // console.log(giphy.responseSaved);
      });
    // console.log(giphy.keyword);
},

  // This function will generate a new button using user's keyword
  customSearch: function() {
    this.keyword = $("#user-input").val();
    if (this.keyword === "") {
        alert("Please write a keyword");
    } else if (this.topics.indexOf(this.keyword) === -1 ) {
        this.topics.push(this.keyword);
        this.generateButtons();
        $("#user-input").val("");
        // console.log("Clicked!");
        // console.log(this);
        // console.log(this.keyword);
    } else {
        alert("Keyword already added");
        $("#user-input").val("");
    }
  },

  // This function generates the GIF images using the promise from the AJAX request
  generateImages: function(response) {
    $("#images").empty();
    $("#add5-button").remove();
    for (let i = 0; i < giphy.numberImages -1; i++) {
      var imageDiv = $("<div>"); 
      imageDiv.addClass("image-div text-left");

      var image = $("<img>");
      image.attr({src: response.data[i].images.fixed_height_still.url, alt: response.data[i].title, "data-url-still": response.data[i].images.fixed_height_still.url, "data-url-move": response.data[i].images.fixed_height.url});
      image.on("click", giphy.switchImage);
      imageDiv.append(image);

      var description = $("<p>");
      description.text("Rating: " + (response.data[i].rating).toUpperCase());
      imageDiv.append(description);
      imageDiv.append($("<p>").text("Title: " + response.data[i].title));

      // This is not working... (image doesn't download)
      // var icon = $("<i class='fas fa-download'></i>");
      // var link = $("<a href='" + response.data[i].images.original.url + "'></a>");
      
      // link.attr("download", "");
      // var linkDiv = $("<div class=' text-right'></div>");
      // link.append(icon);
      // linkDiv.append(link);
      // imageDiv.append(linkDiv);

      $("#images").append(imageDiv);
    }
    // console.log(response.data.length);
    // console.log(response.data);
    // console.log(response);
    giphy.imageIndex = giphy.numberImages;
    $("#custom-div").append($("<button id='add5-button' class='btn btn-danger' onclick='giphy.extraImages()'>+5</button>"));
  },

  extraImages: function(responseSaved) {
    var response = JSON.parse(giphy.responseSaved);
    // console.log(response);
    // console.log(response.data[10]);
    // console.log(giphy.imageIndex);
    index = parseInt(this.imageIndex)

    for (let i = index; i < index + 5; i++) {
      // console.log("i: " + i);
        
      var imageDiv = $("<div>"); 
      imageDiv.addClass("image-div text-left");

      var image = $("<img>");
      image.attr({src: response.data[i].images.fixed_height_still.url, alt: response.data[i].title, "data-url-still": response.data[i].images.fixed_height_still.url, "data-url-move": response.data[i].images.fixed_height.url});
      image.on("click", giphy.switchImage);
      imageDiv.append(image);

      var description = $("<p>");
      description.text("Rating: " + (response.data[i].rating).toUpperCase());
      imageDiv.append(description);
      imageDiv.append($("<p>").text("Title: " + response.data[i].title));

      $("#images").prepend(imageDiv);
    };

    giphy.imageIndex = parseInt(giphy.imageIndex) + 5;
    // console.log("giphy index after loop: " + giphy.imageIndex);
  },

  // Play / Stop GIF animation
  switchImage: function() {
    if ($(this).attr("src") === $(this).attr("data-url-still")) {
        $(this).attr("src", $(this).attr("data-url-move"));
    } else {
        $(this).attr("src", $(this).attr("data-url-still"));
    }
  },

  // This function will dynamically generate the buttons on page load
  generateButtons: function() {
    $("#buttons").empty();
    for (let i = 0; i < giphy.topics.length; i++) {
        var buttonTopic = $("<button>" + giphy.topics[i].toUpperCase() + "</button>");
        buttonTopic.attr({type: "button", "data-keyword": giphy.topics[i]});
        buttonTopic.on("click", giphy.request);
        buttonTopic.addClass("btn btn-primary");
        $("#buttons").append(buttonTopic);
        // console.log(giphy.topics.length);
        // console.log(i);
    };
  },

  updateNumberGIF: function(){
      // giphy.numberImages = $(this).val();
      giphy.numberImages = $(this).attr("data-number");
    }

};

giphy.generateButtons();
$(".button-number").on("click", giphy.updateNumberGIF);

$("#user-input").on("keyup", function(event){
  if (event.keyCode === 13) {
      giphy.customSearch();
  };
});

$("#user-input").val("");

// CHECKLIST:
// ---------

// 1. Generate buttons using array "topics" --OK--
// 2. Add Keyword function, pops the word to the array and re-generates all buttons (empty div first) --OK--
// 3. When a keyword button is clicked, request GIFs using that keyword and display 10 on the webpage --OK--
// 4. When image clicked, start/stop animation --OK--