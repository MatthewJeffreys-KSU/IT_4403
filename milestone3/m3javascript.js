$(document).ready(function(){
    let currentPage = 1;
    let searchResults;

    function search(){
        let searchRequest = "https://openlibrary.org/search.json?q=" + $("#search-text").val() + "&limit=50";

        $.getJSON(searchRequest, updateSearchResults);
    }

    function updateSearchResults(results){
        searchResults = results;
        currentPage = 1;
        displaySearchResults(searchResults);
    }

    function displaySearchResults(results){
        $("#search-results").empty();

        for(i = (currentPage - 1) * 10; i < currentPage * 10; i++){
            if(i < results.docs.length){
                $("<p>").text(results.docs[i].title).data("bookID", results.docs[i].key)
                    .attr("class", "book-link").appendTo("#search-results");
                if ('cover_i' in results.docs[i]) {
                    $("<img>")
                    .attr({"src": "https://covers.openlibrary.org/b/id/" + results.docs[i].cover_i + "-S.jpg", "alt": "Cover of " + results.docs[i].title})
                    .appendTo("#search-results");
                }
                $("<hr>").appendTo("#search-results");
            }
        }

        /* $.each(results.docs, function(index, doc){
            $("<p>").text(doc.title).data("bookID", doc.key).attr("class", "book-link").appendTo("#search-results");
            if ('cover_i' in doc) {
                $("<img>")
                .attr({"src": "https://covers.openlibrary.org/b/id/" + doc.cover_i + "-S.jpg", "alt": "Cover of " + doc.title})
                .appendTo("#search-results");
            }
            $("<hr>").appendTo("#search-results");
        }) */
    }

    function displayBookDetails(workID){
        $("#details-list").empty();
        let request = "https://openlibrary.org" + workID + ".json";

        $.getJSON(request, function(book){
            $("<li>").text(book.title).appendTo("#details-list");
            $("<li>").text("Work ID: " + workID.substring(7)).appendTo("#details-list");
            if(typeof(book.description) == "string"){
                $("<li>").text("Description: " + book.description).appendTo("#details-list");
            }
            else if(typeof(book.description) == "object"){
                $("<li>").text("Description: " + book.description.value).appendTo("#details-list");
            }
            if('subjects' in book){
                let subjects = "Subjects: ";
                for(i = 0; i < 10; i++){
                    if(i < book.subjects.length){
                        subjects += book.subjects[i] + " - ";
                    }
                }
                $("<li>").text(subjects).appendTo("#details-list");
            }
            if('covers' in book){
                $("<li>").append($("<img>")
                .attr({"src": "https://covers.openlibrary.org/b/id/" + book.covers[0] + "-M.jpg"}))
                .appendTo("#details-list");
            }
            $("<li>").append($("<a>").attr("href", "https://openlibrary.org" + book.key)
                .text("Books's page on Open Library")).appendTo("#details-list");
        });
    }
    
    $("#search-button").click(search);
    $("#search-results").on("click", ".book-link", function(){
        displayBookDetails( $(this).data("bookID") );
    });
});