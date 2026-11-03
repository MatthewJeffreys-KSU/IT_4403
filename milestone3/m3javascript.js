$(document).ready(function(){


    function search(){
        let searchRequest = "https://openlibrary.org/search.json?q=" + $("#search-text").val() + "&limit=50";

        $.getJSON(searchRequest, displaySearchResults);
    }

    function displaySearchResults(data){
        $.each(data.docs, function(index, doc){
            if ('cover_i' in doc) {
                $("<img>")
                .attr({"src": "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-S.jpg", "alt": "Cover of " + doc.title})
                .appendTo("#search-results");
            }
            $("<a>").text(doc.title).attr({"href": "book-details.html?workid=" + doc.key}).appendTo("#search-results");
            $("<hr>").appendTo("#search-results");
        })
    }
    
    $("#search-button").click(search);
});