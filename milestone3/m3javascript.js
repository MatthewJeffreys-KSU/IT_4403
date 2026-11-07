$(document).ready(function(){
    let currentPage = 1;
    let searchResults;

    $(".page-selection").hide();

    function search(){
        let searchRequest = "https://openlibrary.org/search.json?q=" + $("#search-text").val() + "&limit=50";

        $.getJSON(searchRequest, updateSearchResults)
        .fail(function(jqXHR, textStatus, errorThrown){
            $("#search-results").empty();
            $("#search-results").append("<p class='error-message'>There was an error retrieving the results: "
                + textStatus + errorThrown + "</p>");
        });
    }

    function updateSearchResults(results){
        searchResults = results;
        currentPage = 1;

        displaySearchResults(searchResults);

        $("#page-select").empty();
        $("#page-select").append("<option value='1' selected>1</option>");
        for(i = 2; i * 10 - 9 <= results.docs.length; i++){
            $("#page-select").append("<option value=" + i + ">" + i + "</option>");
        }
        $(".page-selection").show();
    }

    function displaySearchResults(results){
        $("#search-results").empty();

        if(results.docs.length == 0){
            $("#search-results").append("<p>No results found.</p>");
        }

        for(i = (currentPage - 1) * 10; i < currentPage * 10; i++){
            if(i < results.docs.length){
                $("<p>").text(results.docs[i].title).data("bookID", results.docs[i].key)
                    .attr("class", "pseudolink").appendTo("#search-results");
                if("cover_i" in results.docs[i]){
                    $("<img>")
                    .attr({"src": "https://covers.openlibrary.org/b/id/" + results.docs[i].cover_i + "-S.jpg", "alt": "Cover of " + results.docs[i].title})
                    .appendTo("#search-results");
                }
                $("<hr>").appendTo("#search-results");
            }
        }
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
            if("covers" in book){
                $("<li>").append($("<img>")
                .attr({"src": "https://covers.openlibrary.org/b/id/" + book.covers[0] + "-M.jpg"}))
                .appendTo("#details-list");
            }
            $("<li>").append($("<a>").attr("href", "https://openlibrary.org" + book.key)
                .text("Books's page on Open Library")).appendTo("#details-list");
        });
    }

    function displayCollection(subject){
        $("#search-results").empty();
        $(".page-selection").hide();

        let request = "https://openlibrary.org/subjects/" + subject + ".json?limit=10";

        $.getJSON(request, function(results){
            $.each(results.works, function(index, work){
                $("<p>").text(work.title).data("bookID", work.key)
                    .attr("class", "pseudolink").appendTo("#search-results");
                if("cover_id" in work) {
                    $("<img>")
                    .attr({"src": "https://covers.openlibrary.org/b/id/" + work.cover_id + "-S.jpg", "alt": "Cover of " + work.title})
                    .appendTo("#search-results");
                }
                $("<hr>").appendTo("#search-results");
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown){
            $("#search-results").empty();
            $("#search-results").append("<p class='error-message'>There was an error retrieving the results: "
                + textStatus + "</p>");
        });
    }
    
    $("#search-button").click(search);
    $("#search-results").on("click", ".pseudolink", function(){
        displayBookDetails( $(this).data("bookID") );
    });
    $("#page-select").on("change", function(){
        currentPage = $("#page-select").val();
        displaySearchResults(searchResults);
    });
    $("#collections").on("click", ".pseudolink", function(){
        displayCollection( $(this).data("subject") );
    });
});