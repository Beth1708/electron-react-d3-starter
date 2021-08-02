import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import raw from "raw.macro";
import Papa from 'papaparse';

import './D3Plot.css';

const D3Plot = () => {
    /* The useRef Hook creates a variable that "holds on" to a value across rendering
   passes. In this case it will hold our component's SVG DOM element. It's
   initialized null and React will assign it later (see the return statement) */
    const d3Container = useRef(null);

    const [rows, setRows] = useState([]);

    useEffect(() => {
        const getData = async () => {

            // The path seems to be relative to the pages dir
            const csv = raw('../data/data.csv')
            const results = Papa.parse(csv, { header: true }) // object with { data, errors, meta }
            console.log(results);
            const rows = results.data // array of objects
            setRows(rows);

            const margin = {top: 20, right: 20, bottom: 30, left: 50};
            const width = 960 - margin.left - margin.right;
            const height = 500 - margin.top - margin.bottom;
            // set the ranges
            const x = d3.scaleTime().range([0, width]);
            const y = d3.scaleLinear().range([height, 0]);

            // Add dots
            // svg.append('g')
            //     .selectAll("dot")
            //     .data(data)
            //     .join("circle")
            //     .attr("cx", function (d) { return x(d.time); } )
            //     .attr("cy", function (d) { return y(d.closeNum); } )
            //     .attr("r", 1.5)
            //     .style("fill", "#69b3a2")

            // define the line
            // const valueline = d3.line()
            //     .x(function(d) { return x(d.time); })
            //     .y(function(d) { return y(d.closeNum); });


            // parse the date / time
            const parseTime = d3.timeParse("%d-%b-%y");
            const formatTime = d3.timeFormat("%e %B");

            const data = rows.map((row) => {
                const {date, close} = row;
                const time = parseTime(date);
                const closeNum = +close;
                return {time, closeNum};
            })

            const div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

            const svg = d3.select(d3Container.current).attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // scale the range of the data
            x.domain(d3.extent(data, function(d) { return d.time; }));
            y.domain([0, d3.max(data, function(d) { return d.closeNum; })]);
            // // add the valueline path.
            // svg.append("path")
            //     .data([data])
            //     .attr("class", "line")
            //     .attr("d", valueline);
            //
            // // add the dots with tooltips
            svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 5)
                .attr("cx", function(d) { return x(d.time); })
                .attr("cy", function(d) { return y(d.closeNum); })
                .on("mouseover", function(event,d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html(formatTime(d.time) + "<br/>" + d.closeNum)
                        .style("left", (event.pageX) + "px")
                        .style("top", (event.pageY - 28) + "px");
                })
                .on("mouseout", function(d) {
                    div.transition()
                        .duration(500)
                        .style("opacity", 0);
                });
            //
            // add the X Axis
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // add the Y Axis
            svg.append("g")
                .call(d3.axisLeft(y));
        }
        getData()
    }, []);

    return (
        <svg
            className="d3-component"
            width={400}
            height={200}
            ref={d3Container}
        />
    );

}

export default D3Plot;