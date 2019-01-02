
function loadData() {
    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $ytvideos = $('#youtube-links');

    // clear out old data before new request
    $ytvideos.text("")
    $wikiElem.text("");
    $nytElem.text("");
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr+', '+cityStr;
    $greeting.text('So, you want to live at '+address+'?');
    // Google Street View API does not work anymore because it requires API and signature and billing as well.
    // var streetviewUrl ='http://maps.googleapis.com/maps/api/streetview?size=600x400&location='+address+'';
    // $body.append('<img class="bgimg" src="'+streetviewUrl+'">');

    var nytimesUrl ='https://api.nytimes.com/svc/search/v2/articlesearch.json?q='+cityStr+'&sort=newest&api-key=9ee99d9c8a8b4001be8a0e7104a466e4';
    $.getJSON(nytimesUrl,function(data){
        $nytHeaderElem.text('New York Times Articles About '+cityStr);
        articles=data.response.docs;
        for(var i=0;i<articles.length;i++){
            var article = articles[i];
            $nytElem.append('<li class="article">'+'<a href="'+article.web_url+'">'+article.headline.main+'</a>'+'<p>'+article.snippet+'</p>'+'</li>');

        };
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles could not be loaded.');
    });
    
    //Wikepedia AJAX request goes here
    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    },8000);
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+cityStr+'&format=json&callback=wikiCallback';
    $.ajax({
        url:wikiUrl,
        dataType:'jsonp',// Work around for CORS
        //jsonp: "callback", //this is redundant
        success: function(response){
            var articleList = response[1];
            for (var i=0;i<articleList.length;i++){
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/'+articleStr;
                $wikiElem.append('<li><a href="'+url+'">'+articleStr+'</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    var youtubeUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q="+cityStr+" city&key=AIzaSyA7oModDsPvc75_laQJYoWoPWAjRiVgbwo";
    $.getJSON(youtubeUrl,function(data){
        console.log(data);
        console.log(data.items);
        var videoResponse = data.items;
        console.log(videoResponse);
        for(var i=0;i<videoResponse.length;i++){
            var video = videoResponse[i].id.videoId;
            $ytvideos.append('<iframe src="https://www.youtube.com/embed/'+video+'"'+'width="70%" height="400" align="center" frameborder="0"allowfullscreen></iframe>');
            //$ytvideos.append('<li class="article"><a href="https://www.youtube.com/watch?v='+video+'">'+videoResponse[i].snippet.title+'</a></li>');
        };
    }).error(function(e){
        $ytvideos.text('Relevant YouTube videos could not be loaded.');
    });
    return false;
    
};

$('#form-container').submit(loadData);
