// Set up URL in a variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

//Pull data/samples
function bothcharts(selectedSample) {
    d3.json(url).then(data => {
        const orig_sample = data.samples;

        //filtered data
        const sampleData = orig_sample.find(item => item.id === selectedSample);

        //OTU data
        const otuID = sampleData.otu_ids;
        const labels = sampleData.otu_labels;
        const values = sampleData.sample_values;

        //Horizontal bar chart creation/layout
        const bardata = {
            x: values.slice(0, 10).reverse(),
            y: otuID.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: labels.slice(0, 10).reverse(),
            marker: {
                color: 'green'
            },
            type: "bar",
            orientation: "h",
        };

        const bartrace = [bardata];

        const barLayout = {
            title: "Top 10 OTUs Showing",
        };
        //Plot barchart
        Plotly.newPlot("bar", bartrace, barLayout);

        //Starting bubble chart/layout
        const bubbleData = {
            x: otuID,
            y: values,
            mode: "markers",
            marker: {
                size: values,
                color: otuID,
                text:labels,
                colorscale: 'Greens',
            },
        };

        const bubbleLayout = {
            xaxis: { title: "OTU ID" },
            height: 600,
            width: 1000
        };

        const bubbletrace = [bubbleData];
        
        //Plot bubble chart
        Plotly.newPlot("bubble", bubbletrace, bubbleLayout);
    });
}
//Populating Metadata information
function buildMetadata(selectedSample) {
    d3.json(url).then(data => {
        const metadata = data.metadata;
        const resultArray = metadata.filter(sampleDictionary => sampleDictionary.id == selectedSample);
        const result = resultArray[0];
        const PANEL = d3.select("#sample-metadata").html("");

        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h5").text(`${key}: ${value}`);
        });
    });
}
//Start dashboard with actual selected values
function init() {
    
    //D3 dropdown selection
    const dropdown = d3.select("#selDataset");

    d3.json(url).then((data) => {
        const selectedname = data.names;

        selectedname.forEach((sample) => {
            dropdown
                .append("option")
                .text(sample)
                .property("value", sample);
        });

        const firstSample = selectedname[0];
        bothcharts(firstSample);
        buildMetadata(firstSample);
    });
}
//Updates dashboard as new sample is selected
function optionChanged(secondsample) {
    bothcharts(secondsample);
    buildMetadata(secondsample);
}
//Call function
init();
