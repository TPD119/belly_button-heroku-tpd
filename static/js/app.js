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
    buildGauge(data.WFREQ);
  });
    // BONUS: Build the Gauge Chart
    //
    //console.log(data)
}

function buildGauge(freq) {
  //var freq_url = `/WFREQ/${sample}`;
  //d3.json(freq_url).then(function(data) {
  // Enter a speed between 0 and 180
  //var speed = 175
  // Trig to calc meter point
  //wfreq = (freq/10)*180
  console.log(freq)
  level = (freq/9)*180
  var degrees = 180 - level,
      radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);

  var data = [{ type: 'scatter',
    x: [0], y:[0],
      marker: {size: 28, color:'850000'},
      showlegend: false,
      name: 'freq',
      text: freq,
      hoverinfo: 'text'},
    { values: [50/9,50/9,50/9,50/9,50/9,50/9, 50/9, 50/9, 50/9,50],
    rotation: 90,
    text: ['8-9','7-8','6-7','5-6','4-5', '3-4','2-3','1-2','0-1'],
    textinfo: 'text',
    textposition:'inside',
    marker: {colors:['rgba(202, 209, 95, .5)', 'rgba(232, 226, 202, .5)','rgba(210, 206, 145, .5)',
                          'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                          'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                          'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                          'rgba(255, 255, 255, 0)','']},

    labels: ['8-9','7-8','6-7','5-6','4-5', '3-4','2-3','1-2','0-1',''],
    hoverinfo: 'label',
    hole: .5,
    type: 'pie',
    showlegend: false
  }];

  var layout = {
    shapes:[{
        type: 'path',
        path: path,
        fillcolor: '850000',
        line: {
          color: '850000'
        }
      }],
    title: 'Belly Button Wash Frequency',
    xaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]},
    yaxis: {zeroline:false, showticklabels:false,
              showgrid: false, range: [-1, 1]}
  };

  Plotly.newPlot('gauge', data, layout);
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
      //console.log(response)
      var ids = response[0].otu_ids.slice(0,10);
      var values = response[0].sample_values.slice(0,10);
      var labels = response[0].otu_labels.slice(0,10);
      
      //console.log(response);
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
