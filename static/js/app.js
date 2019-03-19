function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(data) {
    var data = data;
    //console.log(data);
  
  //d3.json(sample)
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(function([key, value]) {
      //console.log(key, value);
      var div = panel.append("div");
      div.text(`${key} : ${value}`);
    });
  });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
    // @TODO: Build a Bubble Chart using the sample data
    d3.json(url).then(function(response) {

      var ids = response.otu_ids;
      var values = response.sample_values;
      var labels = response.otu_labels;
      //console.log(values);
      var trace = {
        mode: "markers",
        name: "Belly Button",
        text: labels,
        x: ids,
        y: values,
        marker: {
          color: ids,
          size: values
        }
      };
      
      var data = [trace];
  
      var layout = {
        title: 'Belly Button Bubble Chart',
        showlegend: false,
      };
  
      Plotly.newPlot("bubble", data, layout);
    });
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    d3.json(url).then(function(response) {
      response = [response]
      response[0].sample_values.sort(function compareFunction(firstNum, secondNum) {
        // resulting order is (3, 2, -120)
       return secondNum - firstNum;
      });
      console.log(response)
      var ids = response[0].otu_ids.slice(0,10);
      var values = response[0].sample_values.slice(0,10);
      var labels = response[0].otu_labels.slice(0,10);
      
      console.log(response);
      var trace1 = {
        labels: ids,
        values: values,
        type: 'pie',
        hoverinfo: labels,
        textinfo: 'test'
      };
      
      var data = [trace1];
  
      var layout = {
        title: 'Belly Button Pie Chart',
        showlegend: true,   
      };
  
      Plotly.newPlot("pie", data, layout);
    });

}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
