fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
)
  .then((res) => res.json())
  .then((res) => {
    const dataset = res["monthlyVariance"];
    const baseTemperature = res["baseTemperature"];
    //console.log(dataset);
    //console.log(baseTemperature);
    generateScales(dataset);
    drawCells(dataset, baseTemperature);
    drawAxis();
  });

let xScale;
let yScale;

const width = 1200;
const height = 600;
const padding = 60;

let minYear;
let maxYear;
let numberOfYears = maxYear - minYear;

const canvas = d3.select("#canvas");
canvas.attr("width", width).attr("height", height);

const tooltip = d3.select("#tooltip");

const generateScales = (dataset) => {
  minYear = d3.min(dataset, (d) => d["year"]);
  maxYear = d3.max(dataset, (d) => d["year"]);

  xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleTime()
    .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
    .range([padding, height - padding]);
};

const drawCells = (dataset, baseTemperature) => {
  canvas
    .selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("fill", (d) => {
      variance = d["variance"];
      const lowAvarage = -1;
      const avarage = 0;
      const lighAvarage = 1;

      if (variance <= lowAvarage) {
        return "#0C1CCA";
      } else if (variance <= avarage) {
        return "LightSteelBlue";
      } else if (variance <= lighAvarage) {
        return "orange";
      } else {
        return "crimson";
      }
    })
    .attr("data-year", (d) => d["year"])
    .attr("data-month", (d) => d["month"] - 1)
    .attr("data-temp", (d) => baseTemperature - d["variance"])
    .attr("height", (height - 2 * padding) / 12)
    .attr("y", (d) => yScale(new Date(0, d["month"] - 1, 0, 0, 0, 0, 0)))
    .attr("width", () => {
      numberOfYears = maxYear - minYear;
      return (width - 2 * padding) / numberOfYears;
    })
    .attr("x", (d) => xScale(d["year"]))
    .on("mouseover", (d) => {
      tooltip.transition().style("visibility", "visible");

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      tooltip.text(
        `${d["year"]} ${monthNames[d["month"] - 1]} - ${
          baseTemperature + d["variance"]
        } (${d["variance"]})`
      );

      tooltip.attr("data-year", d["year"]);
    })
    .on("mouseout", (d) => {
      tooltip.transition().style("visibility", "hidden");
    });
};

const drawAxis = () => {
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));

  canvas
    .append("g")
    .call(xAxis)
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - padding})`);

  canvas
    .append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, 0)`);
};
