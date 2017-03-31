  function check_window_size() {
    var width = $(window).width();
    var height = $(window).height();
    var screenType = null;

    if (width <= 800 || height <= 550) {
      screenType = "mobile";
    }
    else {
      screenType = "web";
    };

    return screenType;
  };


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

  function related_lines(data, coordinates, location) {
    
    var angleX = coordinates[0]["x"] - coordinates[1]["x"];
    var angleY = coordinates[0]["y"] - coordinates[1]['y'];
    var angle = Math.atan2(angleY, angleX);
    var lineFunction = d3.line()


                      .x(function(d) { 
                        var x_coord = +(+(d.x) + 8 * +(Math.cos(angle)));
                        return x_coord; })
                      .y(function(d) { 
                        var y_coord = +(+(d.y) + 8 * +(Math.sin(angle)));
                        return y_coord; })
                      .curve(d3.curveNatural);
    
    var lineGraph = d3.select("#" + data.id)
      .insert("path", ":" + location)
      .attr("overflow", "unset")
      .attr("d", lineFunction(coordinates));
                           

    return lineGraph;
  }

  function add_classes_and_stroke(data) {
          d3.select("#" + data.id).attr("class", "city main " + data.id).select(".cls-16").attr("class", "cls-16 " + data.id);
          d3.select("#" + data.id).select(".cls-20").attr("class", "cls-20 " + data.id);
          d3.select("#" + data.id).select(".cls-18").attr("class", "cls-18 main " + data.id);
          d3.select("#" + data.id + "> .cls-17").attr("class", "cls-17 main").style("stroke", "white");
          if (d3.select("#flag" + data.id) !== null ) {
            d3.select("#flag" + data.id).attr("class", "flag " + data.id)
          };

          var allRelatedLocations = all_related_locations(data);

          for (var i in allRelatedLocations) {
            d3.select("#" + allRelatedLocations[i]).attr("class", "city " + data.id).select(".cls-18").attr("class", "cls-18 " + data.id);
            d3.select("#" + allRelatedLocations[i] + "> .cls-17").style("stroke", "white");
              if (d3.select("#flag" + allRelatedLocations[i]) !== null) {
                d3.select("#flag" + allRelatedLocations[i]).attr("class", "flag " + data.id);
              };
          };

   };

   function remove_classes_and_stroke(data) {
          d3.select("#" + data.id).attr("class", "city").select(".cls-16").attr("class", "cls-16");
          d3.select("#" + data.id).attr("class", "city").select(".cls-20").attr("class", "cls-20");
          d3.select("#" + data.id).select(".cls-18").attr("class", "cls-18");
          d3.select("#" + data.id + "> .cls-17").style("stroke", "#808285");
          if (d3.select("#flag" + data.id) !== null ) {
            d3.select("#flag" + data.id).attr("class", "flag")
          };

          var allRelatedLocations = all_related_locations(data);

          for (var i in allRelatedLocations) {
            d3.select("#" + allRelatedLocations[i]).attr("class", "city").select(".cls-18").attr("class", "cls-18");
            d3.select("#" + allRelatedLocations[i] + "> .cls-17").style("stroke", "#808285");
              if (d3.select("#flag" + allRelatedLocations[i]) !== null) {
                d3.select("#flag" + allRelatedLocations[i]).attr("class", "flag");
              };
          };
   };

  function remove_all_previous_city_classes(data) {
      // Removes city name class and opacity from previously selected cities
        d3.selectAll(".cls-18:not(." + data.id + ")").attr("class", "cls-18");
        d3.selectAll(".city:not(." + data.id + ")").attr("class", "city");
        d3.selectAll(".city:not(." + data.id + ") > .cls-17").style("stroke", "#808285");
        d3.selectAll(".flag:not(." + data.id + ")").attr("class", "flag");

      // Remove the lines drawn for previously selected cities
      d3.select("#cities").selectAll("g:not(#" + data.id + ")").selectAll("path").remove();    

  }