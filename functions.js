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

  function remove_all_classes_and_lines(data) {

      d3.selectAll("#info-box-container, #info-box").attr("class", null);


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