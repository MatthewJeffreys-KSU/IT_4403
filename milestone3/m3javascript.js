$(document).ready(function(){
    let currentPage = 1;

    function search(){
        let searchRequest = "https://openlibrary.org/search.json?q=" + $("#search-text").val() + "&limit=50";

        $.getJSON(searchRequest, displaySearchResults);
    }

    function displaySearchResults(data){
        $("#search-results").replaceChildren();
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

    function displayBookDetails(workID){
        $("#details-list").replaceChildren();
        let request = "https://openlibrary.org" + workID + ".json";

        $.getJSON(request, function(data){
            $("<li>").text(data.title).appendTo("#details-list");
            $("<li>").text("Work ID: " + workID.substring(7)).appendTo("#details-list");
            if(typeof(data.description) == "string"){
                $("<li>").text("Description: " + data.description).appendTo("#details-list");
            }
            else if(typeof(data.description) == "object"){
                $("<li>").text("Description: " + data.description.value).appendTo("#details-list");
            }
            if('subjects' in data){
                let subjects = "Subjects: ";
                for(i = 0; i < 10; i++){
                    if(i < data.subjects.length){
                        subjects += data.subjects[i] + " - ";
                    }
                }
                $("<li>").text(subjects).appendTo("#details-list");
            }
            if('covers' in data){
                $("<li>").append($("<img>")
                .attr({"src": "https://covers.openlibrary.org/b/id/" + data.covers[0] + "-M.jpg"}))
                .appendTo("#details-list");
            }
            $("<li>").append($("<a>").attr("href", "https://openlibrary.org" + data.key)
                .text("Books's page on Open Library")).appendTo("#details-list");
        });
    }
    
    $("#search-button").click(search);
});