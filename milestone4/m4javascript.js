$(document).ready(function(){
    let currentPage = 1;
    let searchResults;

    const resultTemplate = '' + 
        '<div class="result-card">' +
            '{{#cover_i}}<img src="https://covers.openlibrary.org/b/id/{{cover_i}}-S.jpg" alt="Cover of {{title}}">{{/cover_i}}' +
            '<span class="pseudolink" data-bookid="{{key}}">{{title}}</span>' +
        '</div>';

    const detailsTemplate = '' +
        '<div class="details-card">' +
        'Title: {{title}}<br>' +
        'Work ID: {{ID}}<br>' +
        'Written by: {{#authors}}{{.}}, {{/authors}}<br>' +
        '{{#cover}}<img src="https://covers.openlibrary.org/b/id/{{cover}}-M.jpg" alt="Cover of {{title}}"><br>{{/cover}}' +
        '{{#description}}Description: {{description}}<br>{{/description}}' +
        '{{^description}}No description available<br>{{/description}}' +
        'Subjects: {{#subjects}}{{.}}, {{/subjects}}' +
        '{{^subjects}}none listed{{/subjects}}' +
        '</div>';

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
                $("#search-results").append(Mustache.render(resultTemplate, results.docs[i]));
            }
        }
    }

    function displayBookDetails(workID){
        $("#details-list").empty();
        let request = "https://openlibrary.org" + workID + ".json";

        $.getJSON(request, function(book){
            let title = book.title;
            let OLID = book.key.substring(7);
            let names;
            $.each(book.authors, function(index, author){
                $.getJSON("https://openlibrary.org" + author.key + ".json", function(result){
                    names += result.name;
                })
            })
            let cover = book.covers[0];
            let description = book.description;
            let subjects;
            for(i = 0; i < 10; i++){
                if(i < book.subjects.length){
                    subjects += book.subjects[i];
                }
            }

            let data = {
                "title": title,
                "ID": OLID,
                "authors": names,
                "cover": cover,
                "description": description,
                "subjects": subjects
            }

            $("#details-pane").append(Mustache.render(detailsTemplate, data));
        });
    }

    function displayCollection(subject){
        $("#search-results").empty();
        $(".page-selection").hide();

        let request = "https://openlibrary.org/subjects/" + subject + ".json?limit=10";

        $.getJSON(request, function(results){
            $.each(results.works, function(index, work){
                $("<p>").text(work.title).data("bookid", work.key)
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
        console.log( $(this).data("bookid") );
        displayBookDetails( $(this).data("bookid") );
    });
    $("#page-select").on("change", function(){
        currentPage = $("#page-select").val();
        displaySearchResults(searchResults);
    });
    $("#collections").on("click", ".pseudolink", function(){
        displayCollection( $(this).data("subject") );
    });
});