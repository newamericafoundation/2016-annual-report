d3.json("https://na-data-projects.s3-us-west-2.amazonaws.com/data/project_index/annualreportmapdata.json", function(data) {
 
  function all_locations() {
    return d3.selectAll("g");
  }

  function all_location_circle() {
    return d3.selectAll(".cls-18")
  }

  function this_location(data) {
    return d3.select("#" + data.id);
  }

  function this_location_div() {
    return d3.select(".info-box");
  }

  function this_location_circle() {
    return d3.select(".cls-18");
  }

  function all_related_locations(data) {
    var relatedLocations = [];
    
    for (i = 1; i <= parseInt(data.totalProjects); i++){
      var relatedcities = eval('data.related_cities_' + i);
      if (relatedcities !== null) {
        relatedcities = eval('data.related_cities_' + i).split(',');
        relatedLocations.push(relatedcities);
      };
    };  

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

  function project_related_locations(data, rel_cities) {
    if (data.rel_cities != null) {
      return data.rel_cities.split(",")
    };
  }


  function find_coordinates(name) {
      var div_coordinates = {};
      var lat = d3.select("#" + name).select(".cls-18").attr("cx");
      var long = d3.select("#" + name).select(".cls-18").attr("cy");

      div_coordinates["x"] = lat;
      div_coordinates["y"] = long;

      return div_coordinates;
  };


  d3.select("#na-map")
    .selectAll("g")
    .data(data['projectList'], function(d) { return d ? d.id : this.id; })
    
    .on("mouseenter", function(d){

      var div_coordinates = find_coordinates(d.id);
      var relatedLocations = all_related_locations(d);
      var related_coordinates = [];

      for (i=0; i < relatedLocations.length; i++) {
        var coordinates = find_coordinates(relatedLocations[i]);
        related_coordinates.push(coordinates);
      };


      var lineFunction = d3.line()
                            .x(function(d) { return d.x; })
                            .y(function(d) { return d.y; })
                            .curve(d3.curveBasis);

      var svgContainer = d3.select("#" + d.id).append("svg")
                            .attr("overflow", "unset");

      for (i=0; i < related_coordinates.length; i++) {
        var lineData = [];
        lineData.push(div_coordinates, related_coordinates[i]);

        var lineGraph = svgContainer.append("path")
                                    .attr("d", lineFunction(lineData))
                                    .attr("stroke", "#808080")
                                    .attr("stroke-width", .75)
                                    .attr("fill", "#808080");
      };

      return

    })

    .on("mouseleave", function(d){
      d3.select("#" + d.id).select("svg").selectAll("path").remove();
      d3.select("#" + d.id).select("svg").remove();

      return
    })

    .on("click", function(d){
      var thisDiv = this_location_div();
      thisDiv.selectAll(".info-content")
              .data(data['projectList'], function(d) { return d ? d.id : this.id; })
              .exit().remove();
        d3.select(".info-city")
          .text(d.id)

          for (i = 1; i <= parseInt(d.totalProjects); i++) {
              d3.select(".info-box")
                .append("div")
                .classed("info-content", true);
              d3.select(".info-content")
                .append("h2")
                .classed("info-title", true)
                .text(eval("d.project_" + i));
              d3.select(".info-content")
                .append("p")
                .classed("info-text", true)
                .text(eval("d.description_" + i));
              d3.select(".info-content")
                .append("span")
                .classed("info-link", true)
                .html("<a href='" + eval("d.projecturl_" + i) + "'>Read More</a>");
          };

        thisDiv.style("top", d3.event.pageY - 130 + "px")
                .style("left", d3.event.pageX - 50 + "px")
      return thisDiv.attr("class", "info-box selected")
    });
    


    // .on("click", function(d){
    //   var allLocations = d3.selectAll("g");
    //   var thisLocation = d3.select("#" + d.id)
    //   var thisLocationDiv = d3.select(".info-box")
    //   var thisLocationCircle = d3.select(".cls-18");

    //   // if related paths exist, separate them.
    //   if (d.related_ID !== null) {
    //     var relatedPaths = d.related_ID.split(",")
    //   };

    //     if (thisPath.classed("selected")) {
    //         allPath.classed("selected", false)
    //                // .classed("related", false)
    //                .classed("add-opacity", false) 
    //         thisPath.classed("related", false)
          
    //           return thisDiv.attr("class", "info-box")
    //     }
    //     else {
    //         allPath.classed("selected", false)
    //                 .classed("add-opacity", true)
    //         thisPath.classed("selected", true)
    //                 .classed("add-opacity", false)
            
    //         if (relatedPaths) {
    //           for (i = 0; i < relatedPaths.length; i++) {
    //             d3.select("#" + relatedPaths[i])
    //               .classed("related", true)
    //               .classed("add-opacity", false)
                  
    //           };
    //         }; 

    //         thisDiv.select(".info-content")
    //                .text(d.name)
    //         thisDiv.style("top", d3.event.pageY - 130 + "px")
    //                .style("left", d3.event.pageX - 50 + "px")
    //         return thisDiv.attr("class", "info-box selected")
    //     };
    // })

});
