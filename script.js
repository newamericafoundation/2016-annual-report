//   https://docs.google.com/spreadsheets/d/1sCFXKQ6nGw1Hr0yMfQ7CtVBX87hIzQAxpvtyUdpL4JY/edit#gid=0 for spreadsheet

d3.json("https://na-data-projects.s3-us-west-2.amazonaws.com/data/project_index/annualreportmapdata.json", function(data) {
 
  function all_related_locations(data) {
    var relatedLocations = [];
    
    for (var i = 1; i <= +(data.totalProjects); i++){
      var relatedcities = data["related_cities_" + i];
      if (relatedcities !== null) {
        relatedcities = data["related_cities_" + i].split(',');
        relatedLocations.push(relatedcities);
      };
    };  

    // allRelatedLocations is stored as one single array. Concat & apply functions 
    // allows the array of arrays in relatedLocations to become one.

    var allRelatedLocations = [].concat.apply([], relatedLocations);

    allRelatedLocations = remove_duplicates(allRelatedLocations);
    
    return allRelatedLocations;
  }


  function remove_duplicates(array) {
    var seen = {};
    var returnArray = [];
    for (var i = 0; i < array.length; i++) {
        if (!(array[i] in seen)) {
            returnArray.push(array[i]);
            seen[array[i]] = true;
        }
    }
    return returnArray;

}

  function project_related_locations(data, i) {
    if (data["related_cities_" + i] != null) {
      return data["related_cities_" + i].split(",")
    }
    else {
      return null; 
    }
      ;
  }


  function find_coordinates(name) {
      var div_coordinates = {};
      var lat = d3.select("#" + name).select(".cls-18").attr("cx");
      var long = d3.select("#" + name).select(".cls-18").attr("cy");

      div_coordinates["x"] = lat;
      div_coordinates["y"] = long;

      return div_coordinates;
  };

  function related_lines(data, coordinates) {

    var lineFunction = d3.line()
                      .x(function(d) { return d.x; })
                      .y(function(d) { return d.y; })
                      .curve(d3.curveNatural);
    
    var lineGraph = d3.select("#" + data.id)
      .append("path")
      .attr("overflow", "unset")
      .attr("d", lineFunction(coordinates));

    return lineGraph;
  }

  function remove_all_data(data) {
      // Removes city name class and opacity for previously selected cities
      if (d3.selectAll(".cls-18").attr("class") !== "cls-18 " + data.id) {
        d3.selectAll(".cls-18:not(." + data.id + ")").attr("class", "cls-18").attr("opacity", 1);
        d3.selectAll(".city:not(." + data.id + ")").attr("class", "city").attr("opacity", 1);
        d3.selectAll(".flag:not(." + data.id + ")").attr("class", "flag").attr("opacity", 1);
        d3.selectAll("#map, #waves, #clouds").attr("opacity", 1);
      };

      // Remove the lines drawn for previously selected cities
      d3.select("#cities").selectAll("g:not(#" + data.id + ")").selectAll("path").remove();    

  }


  d3.select("#na-map")
    .selectAll("g")
    .data(data['projectList'], function(d) { return d ? d.id : this.id; })
    
    .on("mouseenter", function(d){

      if (d3.select("#info-box").attr("class") !== "selected " + d.id) {

        var div_coordinates = find_coordinates(d.id);
        var relatedLocations = all_related_locations(d);
        var related_coordinates = [];

        for (var i=0; i < relatedLocations.length; i++) {
          var coordinates = find_coordinates(relatedLocations[i]);
          related_coordinates.push(coordinates);
        };


        for (var i=0; i < related_coordinates.length; i++) {
          var lineData = [];
          lineData.push(div_coordinates, related_coordinates[i]);

          var lineGraph =  related_lines(d, lineData);

          lineGraph.attr("stroke", "#808080")
                   .attr("stroke-width", 1)
                   .attr("fill", "#808080")
                   .attr("class", "lineClass " + d.id);
        };

     };

    })


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

      remove_all_data(this);

      // Remove data from previously selected cities
      thisDiv.selectAll(".info-content")
        .data(data['projectList'], function(d) { return d ? d.id : this.id; })
        .exit().remove();


      // Create data for selected city
        d3.select("#info-city")
          .text(d.name)

        var divContent = d3.select("#info-box").select(".info-content")

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
                  .html("<a href='" + d["projecturl_" + i] + "'> Read More</a>");
              };
              
              var divCoordinates = find_coordinates(d.id);
              var projectrelatedLocations = project_related_locations(d, i);
              if (projectrelatedLocations !== null) {
                var relatedCoordinates = find_coordinates(projectrelatedLocations);
              };
          };

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

      }
      
      // Adds opacity to all items except selected item and its related locations
      d3.selectAll("#map, #waves, .flag:not(." + d.id +"), .city:not(." + d.id + "), .cls-18:not(." + d.id + "), #clouds")
        .attr("opacity", 0.5);

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
          remove_all_data(this);
          d3.select("#info-box-container, #info-box").classed("selected " + this.id, false);
      });


});
