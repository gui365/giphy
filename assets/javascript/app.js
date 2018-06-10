var giphy = {
  apiKey: "6TOJn9Z285U9hfH7TGvprMzuhQhzncPw",
  topics: ["angry", "happy", "ecstatic", "sad", "mad", "crazy", "emotional"],
  // User's custom keyword
  keyword: "",
  
  // AJAX request to Giphy API using the keywords of the array
  request() {
    giphy.keyword = ($(this).attr("data-keyword"));
    $.ajax({
        url: "https://api.giphy.com/v1/gifs/search?q=" + giphy.keyword + "&api_key=" + giphy.apiKey + "&limit=10",
        method: "GET"
      }).then(giphy.generateImages);
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
        // console.log("Clicked!");
        // console.log(this);
        // console.log(this.keyword);
    } else {
        alert("Keyword already added");
    }
  },

  // This function generates the GIF images using the promise from the AJAX request
  generateImages: function(response) {
    $("#images").empty();
    for (let i = 0; i < response.data.length; i++) {
      var imageDiv = $("<div>"); 
      imageDiv.addClass("image-div");
      var image = $("<img>");
      image.attr({src: response.data[i].images.fixed_height_still.url, alt: response.data[i].title, "data-url-still": response.data[i].images.fixed_height_still.url, "data-url-move": response.data[i].images.fixed_height.url});
      image.on("click", giphy.switchImage);
      imageDiv.append(image);
      var description = $("<p>");
      description.text("Rating: " + (response.data[i].rating).toUpperCase());
      imageDiv.append(description);
      $("#images").append(imageDiv);
    }
    // console.log(response.data.length);
    // console.log(response.data);
    // console.log(response);
  },

  // Play / Stop GIF animation
  switchImage: function() {
    if ($(this).attr("src") === $(this).attr("data-url-still")) {
        $(this).attr("src", $(this).attr("data-url-move"))
    } else {
        $(this).attr("src", $(this).attr("data-url-still"))
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
  }

};

giphy.generateButtons();


// CHECKLIST:
// ---------

// 1. Generate buttons using array "topics" --OK--
// 2. Add Keyword function, pops the word to the array and re-generates all buttons (empty div first) --OK--
// 3. When a keyword button is clicked, request GIFs using that keyword and display 10 on the webpage --OK--
// 4. When image clicked, start/stop animation --OK--