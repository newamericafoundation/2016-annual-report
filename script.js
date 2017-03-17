//   https://docs.google.com/spreadsheets/d/1sCFXKQ6nGw1Hr0yMfQ7CtVBX87hIzQAxpvtyUdpL4JY/edit#gid=0 for spreadsheet
// add a hovered class with the information for .lineclass; change the info in .lineclass to default
// use body selector to change event.target to inactive

$(document).ready(function(){

  var screenType = check_window_size();

    if (screenType == "web"){
      web_functions();
    }

    else {
      mobile_functions();
    };

  
  $(window).on("resize", function(){

    screenType = check_window_size();
    
    if (screenType == "web"){
      web_functions();
    }

    else {
      mobile_functions();
    };
  
  });



function web_functions() {

    d3.json("https://na-data-projects.s3-us-west-2.amazonaws.com/data/project_index/annualreportmapdata.json", function(data) {
   
     var currentData = null;
     var infoBox = d3.select("#info-box");
     var infoBoxandContainer = d3.selectAll("#info-box-container, #info-box");

     // Select all cities
      d3.selectAll("#cities *")
      // Bind data
        .data(data['projectList'], function(d) { return d ? d.id : this.id; })
        
        .on("mouseenter", function(thisData){
          // if any city is selected, change the hover settings for all other cities on the map
          if (infoBox.classed("selected") === true) {
            var selectedCity = infoBox.attr("class");
            selectedCity = selectedCity.replace("selected ", "");
            d3.selectAll(".city:not(." + selectedCity + "):hover")
              .style("cursor", "unset");
            d3.selectAll("#cities > g:not(." + selectedCity + ") > .cls-17")
              .style("stroke", "#808285")
              .style("fill", "#808285");
            return;
          
          } 

          else {

            // then find each of the hovered city's related locations, and draw lines to them 
              if (infoBox.attr("class") !== "selected " + thisData.id) {

                var divCoordinates = find_coordinates(thisData.id);
                var relatedLocations = all_related_locations(thisData);
                var relatedCoordinates = [];

                  for (var i=0; i < relatedLocations.length; i++) {
                    var coordinates = find_coordinates(relatedLocations[i]);
                    relatedCoordinates.push(coordinates);
                  };


                  for (var i=0; i < relatedCoordinates.length; i++) {
                    var lineData = [];
                    lineData.push(divCoordinates, relatedCoordinates[i]);

                    var lineGraph =  related_lines(thisData, lineData, "first-child");

                    lineGraph.attr("class", "lineClass " + thisData.id);
                  };

                // Add a class of the city's name to each city and its related locations
                add_classes_and_stroke(thisData);
            
                // Adds opacity to all items except selected item and its related locations
                d3.selectAll("#map, #waves, .flag:not(." + thisData.id +"), .city:not(." + thisData.id + "), .cls-18:not(." + thisData.id + "), #clouds")
                  .attr("opacity", 0.5);

            }; // closes if statement
          };

        }) // closes mouseenter event


    // If the item is not the selected (clicked) city, remove the paths on mouseover

        .on("mouseleave", function(d){
          // if any city is clicked, don't do anything on mouseleave
          if (infoBox.classed("selected") == true) {
            return;
          
          } else {

          // otherwise, if this city is not the selected city, remove all lines that have been created,
          // and change the styling of every time to its default state
          if (infoBox.attr("class") !== "selected " + d.id) { 
            // change cursor settings
            d3.selectAll(".city:hover")
              .style("cursor", "pointer");
            d3.selectAll("#cities > g > .cls-17")
              .style("stroke", "#808285")
              .style("fill", "#808285");
            // removes all lines that have been created
            d3.selectAll(".city").selectAll("path").remove();
            // changes the opacity of all other map elements
            d3.selectAll("#map, #waves, .flag, .city, .cls-18, #clouds").attr("opacity", 1);
            remove_classes_and_stroke(d);
            infoBoxandContainer.attr("class", null);
            infoBoxandContainer.style("display", "none");
          };
          
          };

        })


        .on("click", function(d){

          if (infoBox.classed("selected") === true) {
            return;
          }
          else {
            currentData = d;
            var allRelatedLocations = all_related_locations(currentData);

            // Remove classes from previously selected cities
            infoBoxandContainer.attr("class", null);
            remove_classes_and_stroke(currentData);
            remove_all_previous_city_classes(currentData);

            // Remove data from previously selected cities
            infoBox.selectAll(".info-content")
              .data(data['projectList'], function(d) { return d ? d.id : this.id; })
              .exit().remove();

            // Create data for currently selected city
              d3.select("#info-city")
                .text(currentData.name)


                for (var i = 1; i <= +(currentData.totalProjects); i++) {
                    infoBox.append("div")
                      .classed("info-content", true)
                      .attr("id", "project_" + i)
                      .append("h2")
                      .classed("info-title", true)
                      .text(currentData["project_" + i]);
                    d3.select("#project_" + i)
                      .append("p")
                      .classed("info-text", true)
                      .text(currentData["description_" + i]);

                  if (currentData["projecturl_" + i] !== null) {
                      d3.select("#project_" + i)
                        .append("span")
                        .classed("info-link", true)
                        .html("<a href='" + currentData["projecturl_" + i] + "' target='_blank'> Read More</a>");
                    };

                  }; // closes for loop

                // creates lines in the case that a user clicks on another city while another city is selected
                if (("#" + currentData.id + " > .linegraph") !== true) {

                  var divCoordinates = find_coordinates(currentData.id);
                  var relatedLocations = all_related_locations(currentData);
                  var relatedCoordinates = [];

                    for (var i=0; i < relatedLocations.length; i++) {
                      var coordinates = find_coordinates(relatedLocations[i]);
                      relatedCoordinates.push(coordinates);
                    };


                    for (var i=0; i < relatedCoordinates.length; i++) {
                      var lineData = [];
                      lineData.push(divCoordinates, relatedCoordinates[i]);

                      var lineGraph =  related_lines(currentData, lineData, "first-child");

                      lineGraph.attr("class", "lineClass " + currentData.id);
                    }
                  };

                d3.selectAll(".info-content")
                  .on("mouseenter", function(){
                    if (+(currentData.totalProjects) >= 2) {
                      var thisContentDiv = this.getAttribute("id");
                      var projectNumber = thisContentDiv.replace("project_", "");
                      var divCoordinates = find_coordinates(currentData.id);
                      var relatedLocations = project_related_locations(currentData, projectNumber);
                      var relatedCoordinates = [];

                      if (relatedLocations !== null) {
                        for (var i=0; i < relatedLocations.length; i++) {
                          var coordinates = find_coordinates(relatedLocations[i]);
                          relatedCoordinates.push(coordinates);
                        }; // closes for statement


                        for (var i=0; i < relatedCoordinates.length; i++) {
                          var lineData = [];
                          lineData.push(divCoordinates, relatedCoordinates[i]);
                          var lineGraph =  related_lines(currentData, lineData, "nth-last-of-type(2)");
                          lineGraph.attr("class", "lineClass lineClass2 " + currentData.id);
                        }; // closes for statement
                      }; // closes inner if statement
                    }; // closes outer if statement
                  }) // closes mouseenter event  

                .on("mouseleave", function(){
                  if (d3.selectAll(".lineclass2")) {
                      d3.selectAll(".lineClass2").remove();
                  };
                }); // closes mouseleave event 


                // Adds a class of the selected city's name to each city and its related locations and elements
               add_classes_and_stroke(currentData);
            
                // Adds opacity to all map elements except selected item and its related locations
                d3.selectAll("#map, #waves, .flag:not(." + currentData.id +"), .city:not(." + currentData.id + "), .cls-18:not(." + currentData.id + "), #clouds")
                  .attr("opacity", 0.5);

                // Opens info-box in a location that is visible on the screen.

                var infoBoxContainer = d3.select("#info-box-container");

                    if (d3.event.pageY <= (document.documentElement.clientHeight/2)) {
                        infoBoxContainer.style("top", d3.event.pageY + 3 + "px") 
                      } else {
                        infoBoxContainer.style("top", d3.event.pageY - 130 + "px")
                      };

                    if (d3.event.pageX >= (document.documentElement.clientWidth/2)) {
                            infoBoxContainer.style("left", d3.event.pageX - 235 + "px")
                        } else {
                          infoBoxContainer.style("left", d3.event.pageX + 3 + "px")
                        };

                    infoBoxandContainer.style("display", null).attr("class", "selected " + currentData.id);
              };
            }); // closes on-click event 


        d3.select("#exit")
          .on("click", function (){
              d3.selectAll("#map, #waves, .flag, .city, .cls-18, #clouds").attr("opacity", 1);
              remove_classes_and_stroke(currentData);
              remove_all_previous_city_classes(currentData);
              d3.select("#" + currentData.id).selectAll("path").remove();

              infoBoxandContainer.attr("class", null);
              infoBoxandContainer.style("display", "none").style("opacity", 0);
          });

      d3.select("body")
        .on("click", function(event){

          if (screenType === "web") {

            if (d3.event.target.id == "info-box" || d3.event.target.className["baseVal"] == "cls-18 main " + currentData.id || d3.event.target.className["baseVal"] == "cls-17 main"
                || d3.event.target.className["baseVal"] == "cls-16 " + currentData.id) {
              return;
            }

            if($(d3.event.target).closest('#info-box').length)
              return; 

            d3.selectAll("#map, #waves, .flag, .city, .cls-18, #clouds").attr("opacity", 1);
            remove_classes_and_stroke(currentData);
            remove_all_previous_city_classes(currentData);
            d3.select("#" + currentData.id).selectAll("path").remove();

            infoBoxandContainer.attr("class", null);
            infoBoxandContainer.style("display", "none").style("opacity", 0);
          }

          else {
            return;
          };

       });
      });


}

function mobile_functions() {

      // edit footer for stickiness

    d3.json("https://na-data-projects.s3-us-west-2.amazonaws.com/data/project_index/annualreportmapdata.json", function(data) {
   
     var currentData = null;
     var infoBox = d3.select("#info-box");
     var infoBoxandContainer = d3.selectAll("#info-box-container, #info-box");

      d3.selectAll(".mobile-info-header")
        .data(data['projectList'], function(d) { return d ? d.id : this.id.replace("mobile-", ""); })
        .on("click", function(d){
            var divID = "mobile-" + d.id;
            thisID = d3.select("#" + divID);
          if (thisID.classed("mobile-info-header selected " + d.id) === true){
              thisID.select(".icon").attr("class", "icon");
              
              var transitionTime = 750 * +(d.totalProjects);
              thisID.selectAll(".info-box-mobile")
                .style("min-height", "150px")
                .transition().duration(transitionTime) 
                .style("min-height", "0px");

              thisID.select(".info-box-mobile").transition().delay(transitionTime + 250).remove();
              thisID.attr("class", "mobile-info-header").transition().delay(100).style("padding-bottom", "1%");
              return;
          } 

          else {
          
            thisID.selectAll(".icon").attr("class", "icon isActive " + divID);
            thisID.attr("class", "mobile-info-header selected " + d.id);

            for (var i = 1; i <= +(d.totalProjects); i++) {
              thisID.insert("div")
                .attr("class", "info-box-mobile")
                .attr("id", "project_" + i)
                .style("height", 0)
                .transition().duration(750*i) 
                .style("min-height", "150px");
              thisID.select("#project_" + i)
                .append("h3")
                .classed("info-title", true)
                .text(d["project_" + i]);
              thisID.select("#project_" + i)
                .append("p")
                .classed("info-text", true)
                .text(d["description_" + i]);

              if (d["projecturl_" + i] !== null) {
                thisID.select("#project_" + i)
                    .append("span")
                    .classed("info-link", true)
                    .html("<a href='" + d["projecturl_" + i] + "' target='_blank'> Read More</a>");
                }; // closes if statement

              thisID.style("padding-bottom", 0);
            }; // closes for loop
          }; // closes inner else statments
        }); // closes on click function
      }); // closes mobile functions
    } // closes mobile statement

}); //close document ready
