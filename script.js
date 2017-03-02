//   https://docs.google.com/spreadsheets/d/1sCFXKQ6nGw1Hr0yMfQ7CtVBX87hIzQAxpvtyUdpL4JY/edit#gid=0 for spreadsheet

d3.json("https://na-data-projects.s3-us-west-2.amazonaws.com/data/project_index/annualreportmapdata.json", function(data) {
 
  d3.select("#na-map")
    .selectAll("g")
    .data(data['projectList'], function(d) { return d ? d.id : this.id; })
    
    .on("mouseenter", function(d){

      if (d3.select("#info-box").attr("class") !== "selected " + d.id) {

        var divCoordinates = find_coordinates(d.id);
        var relatedLocations = all_related_locations(d);
        var relatedCoordinates = [];

        for (var i=0; i < relatedLocations.length; i++) {
          var coordinates = find_coordinates(relatedLocations[i]);
          relatedCoordinates.push(coordinates);
        };


        for (var i=0; i < relatedCoordinates.length; i++) {
          var lineData = [];
          lineData.push(divCoordinates, relatedCoordinates[i]);

          var lineGraph =  related_lines(d, lineData);

          lineGraph.attr("class", "lineClass " + d.id);
        };
     };

    }) // closes mouseenter event


// If the item is not the selected (clicked) city, remove the paths on mouseover

    .on("mouseleave", function(d){
      if (d3.select("#info-box").attr("class") !== "selected " + this.id) { 
        d3.select("#" + d.id).selectAll("path").remove();
      };
    })


    .on("click", function(d){
      var thisDiv = d3.select("#info-box");
      var allRelatedLocations = all_related_locations(d);
      // console.log(this.id);

      remove_all_classes_and_lines(this);

      // Remove data from previously selected cities
      thisDiv.selectAll(".info-content")
        .data(data['projectList'], function(d) { return d ? d.id : this.id; })
        .exit().remove();


      // Create data for selected city
        d3.select("#info-city")
          .text(d.name)


          for (var i = 1; i <= +(d.totalProjects); i++) {
              thisDiv.append("div")
                .classed("info-content", true)
                .attr("id", "project_" + i)
                .append("h2")
                .classed("info-title", true)
                .text(d["project_" + i]);
              d3.select("#project_" + i)
                .append("p")
                .classed("info-text", true)
                .text(d["description_" + i]);

            if (d["projecturl_" + i] !== null) {
                d3.select("#project_" + i)
                  .append("span")
                  .classed("info-link", true)
                  .html("<a href='" + d["projecturl_" + i] + "' target='_blank'> Read More</a>");
              };

            }; // closes for loop

        d3.select("#info-box")
          .on("mouseover", function (){
            d3.selectAll(".info-content")
              .on("mouseenter", function(){
                var thisContentDiv = this.getAttribute("id");
                var projectNumber = thisContentDiv.replace("project_", "");
                var divCoordinates = find_coordinates(d.id);
                var relatedLocations = project_related_locations(d, projectNumber);
                var relatedCoordinates = [];

                if (relatedLocations !== null) {
                  for (var i=0; i < relatedLocations.length; i++) {
                    var coordinates = find_coordinates(relatedLocations[i]);
                    relatedCoordinates.push(coordinates);
                  }; // closes for statement


                  for (var i=0; i < relatedCoordinates.length; i++) {
                    var lineData = [];
                    lineData.push(divCoordinates, relatedCoordinates[i]);
                    var lineGraph =  related_lines(d, lineData);
                    lineGraph.attr("class", "lineClass lineClass2 " + d.id);
                  }; // closes for statement
                }; // closes if statement
              }) // closes inner mouseover event  

              .on("mouseleave", function(){
                if (d3.selectAll(".lineclass2")) {
                    d3.selectAll(".lineClass2").remove();
                    ;
                };
              }); // closes mouseleave event 
          }); // closes outer mouseover event


      // Adds a class of the selected city's name to each city and its related locations and elements
      d3.select("#" + d.id).attr("class", "city " + d.id).select(".cls-18").attr("class", "cls-18 " + d.id);

      if (d3.select("#flag" + d.id) !== null ) {
        d3.select("#flag" + d.id).attr("class", d.id)
      };

      for (var i in allRelatedLocations) {
        d3.select("#" + allRelatedLocations[i]).attr("class", "city " + d.id).select(".cls-18").attr("class", "cls-18 " + d.id);
          if (d3.select("#flag" + allRelatedLocations[i]) !== null) {
            d3.select("#flag" + allRelatedLocations[i]).attr("class", "flag " + d.id);
          };
      };
      
      // Adds opacity to all items except selected item and its related locations
      d3.selectAll("#map, #waves, .flag:not(." + d.id +"), .city:not(." + d.id + "), .cls-18:not(." + d.id + "), #clouds")
        .attr("opacity", 0.7);

      // Opens info-box in a location that is visible on the screen.

          if (d3.event.pageY <= (document.documentElement.clientHeight/2)) {
              d3.select("#info-box-container").style("top", d3.event.pageY + 3 + "px") 
            } else {
              d3.select("#info-box-container").style("top", d3.event.pageY - 130 + "px")
            };

          if (d3.event.pageX >= (document.documentElement.clientWidth/2)) {
                  d3.select("#info-box-container").style("left", d3.event.pageX - 235 + "px")
              } else {
                d3.select("#info-box-container").style("left", d3.event.pageX + 3 + "px")
              };

          d3.select("#info-box-container").attr("class", "selected " + d.id);
          d3.select("#info-box").attr("class", "selected " + d.id);
    });


    d3.select("#exit")
      .on("click", function (){
          remove_all_classes_and_lines(this);
          d3.select("#info-box-container, #info-box").classed("selected " + this.id, false);
      });

});
