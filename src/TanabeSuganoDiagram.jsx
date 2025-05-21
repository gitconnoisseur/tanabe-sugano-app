import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const configs = {
  'd2': { terms: [
      { label: '3T1(F)', color: 'steelblue', allowed: true, fn: (x) => 0 },
      { label: '3T2(F)', color: 'orange', allowed: true, fn: (x) => 0.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3A2(F)', labelPosX: 35, labelAdjustX: 0, labelAdjustY: -30, color: 'green', allowed: true, fn: (x) => 1.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3T1(P)', color: 'purple', allowed: true, fn: (x) => 14.864 + 0.6827*x + 0.009024*x**2 - 0.00009750*x**3 },
      { label: '1T2(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: 20, allowed: false, fn: (x) => 13.852 + 0.3724*x - 0.03294*x**2 +0.001387*x**3 -0.00002830*x**4 + 2.2359*(10**-7)*x**5 },
      { label: '1E(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: -10, allowed: false, fn: (x) => 13.84 + 0.7374*x -0.08559*x**2 +0.004311*x**3 -0.00009952*x**4 + 8.5933*(10**-7)*x**5 },
      { label: '1T2(G)', allowed: false, fn: (x) => 20.84 + 0.2285*x +0.05275*x**2 -0.002032*x**3 +0.00003996*x**4 -3.1056*(10**-7)*x**5 },
      { label: '1E(G)', labelPosX: 27, labelAdjustX: 0, labelAdjustY: -20, allowed: false, fn: (x) => 20.84 + 0.8688*x +0.1047*x**2 -0.004917*x**3 +0.0001102*x**4 -9.3770*(10**-7)*x**5 },
      { label: '1T1(G)', allowed: false, fn: (x) => 20.84 + 0.8031*x +0.009562*x**2 -0.0003032*x**3 +5.3568*10**-6*x**4 -3.9187*(10**-8)*x**5 },
      { label: '1A1(G)', allowed: false, fn: (x) => 20.84 + 1.0286*x -0.02882*x**2 +0.0001739*x**3 +7.2070*10**-6*x**4 -1.062*(10**-7)*x**5 },
      { label: '1A1(S)', labelPosX: 14, labelAdjustX: -5, labelAdjustY: -20, allowed: false, fn: (x) => 52.94 + 0.5774*x +0.04798*x**2 -0.0007824*x**3 +3.5591*10**-6*x**4 +2.7330*(10**-7)*x**5 },
    ], freeIonLabels: [
      { label: '1S', labelPosY: 52.94, labelAdjustY: 8 },
      { label: '1G', labelPosY: 20.84, labelAdjustY: 5 },
      { label: '3P', labelPosY: 15, labelAdjustY: -5 },
      { label: '3F', labelPosY: 0, labelAdjustY: -5 },
      { label: '1D', labelPosY: 13.84, labelAdjustY: 15 },
    ]},
  'd7': { terms: [
    { label: '4T1(F)', allowedEnd: 21.29, color: 'steelblue', allowed: true, fn: (x) => x <= 21.29 ? 0 :  -1.9078*x +0.1539*x**2 -0.004026*x**3 +0.00005191*x**4 -2.638*(10**-7)*x**5 },
    { label: '4T2(F)', allowedEnd: 21.29, color: 'orange', allowed: true, fn: (x) => x <= 21.29 ? 0.8002*x +0.01055*x**2 -0.0004101*x**3 +0.00001007*x**4 -1.1280*(10**-7)*x**5 : -1.0867*x +0.1608*x**2 -0.004186*x**3 +0.00005391*x**4 -2.741*(10**-7)*x**5 },
    { label: '4A2(F)', allowedEnd: 21.29, labelPosX: 31, labelAdjustX: 0, labelAdjustY: -15, allowed: true, color: 'green', fn: (x) => x <= 21.29 ? 1.800*x +0.01055*x**2 -0.0004101*x**3 +0.00001007*x**4 -1.128*(10**-7)*x**5 : 40.7412738 -6.3145*x +0.5340*x**2 -0.01515*x**3 +0.0002120*x**4 -0.000001171*x**5 },
    { label: '4T1(P)', allowedEnd: 21.29, allowed: true, color: 'purple', fn: (x) => x <= 21.29 ? 15 + 0.6004*x +0.02109*x**2 -0.0008202*x**3 +0.00002014*x**4 -2.256*(10**-7)*x**5 : 32.5880254 -3.954*x +0.3288*x**2 -0.009080*x**3 +0.0001242*x**4 -6.714*(10**-7)*x**5 },
    { label: '2T2(G)', allowedStart: 21.29, allowed: true, color: 'teal', fn: (x) => x <= 21.29 ? 17.89 + 0.4322*x -0.04047*x**2 +0.001839*x**3 -0.00003862*x**4 +2.633*(10**-7)*x**5 : 19.7133408 -1.900*x +0.1534*x**2 -0.004021*x**3 + 0.00005196*x**4 -2.646*(10**-7)*x**5 },
    { label: '2E(G)', allowedStart: 21.29, labelPosX: 16, labelAdjustX: 0, labelAdjustY: -10, allowed: true, color: 'crimson', fn: (x) => x <= 21.29 ? 17.89 + 0.4470*x -0.2604*x**2 +0.02312*x**3 -0.0009743*x**4 +0.00001557*x**5 : 0 },
    { label: '2T1(G)', allowedStart: 21.29, labelPosX: 40, labelAdjustX: 0, labelAdjustY: 15, allowed: true, color: 'maroon', fn: (x) => x <= 21.29 ? 17.89 + 0.6824*x -0.1264*x**2 +0.01087*x**3 -0.0004517*x**4 +7.236*(10**-6)*x**5 : 19.0321308 -2.174*x +0.1835*x**2 -0.005291*x**3 +0.00007531*x**4 -4.225*(10**-7)*x**5 },
    { label: '2A1(G)', allowedStart: 21.29, labelPosX: 37.5, labelAdjustX: -10, labelAdjustY: -20, allowed: true, color: 'orchid', fn: (x) => x <= 21.29 ? 17.89 + 0.8186*x +0.001488*x**2 +0.0009939*x**3 -0.00007574*x**4 +1.689*(10**-6)*x**5 : 38.1477383 -4.447*x +0.3761*x**2 -0.01087*x**3 +0.0001549*x**4 -8.697*(10**-7)*x**5 },
    { label: '2A2(G)', allowedStart: 21.29, labelPosX: 28, labelAdjustX: -20, labelAdjustY: -5, allowed: true, color: 'olive', fn: (x) => x <= 21.29 ? 37.8894523 + 0.8190*x +0.001386*x**2 +0.001004*x**3 -0.00007620*x**4 +1.696*(10**-6)*x**5 : 58.1477383 -4.447*x +0.3761*x**2 -0.01087*x**3 +0.0001549*x**4 -8.697*(10**-7)*x**5 },
  ], freeIonLabels: [
    { label: '4F', labelPosY: 0, labelAdjustY: -5 },
    { label: '4P', labelPosY: 15, labelAdjustY: 22 },
    { label: '2G', labelPosY: 18, labelAdjustY: 7 },
    { label: '2F', labelPosY: 38, labelAdjustY: 13 },
  ]},
};

const TanabeSuganoDiagram = () => {
  const svgRef = useRef();
  const [deltaB, setDeltaB] = useState(25);
  const [config, setConfig] = useState('d2');

  useEffect(() => {
    const terms = configs[config].terms;
    const freeIonLabels = configs[config].freeIonLabels;
    const width = 570;
    const height = 800;
    const margin = { top: 20, right: 40, bottom: 60, left: 60 };
    const yMax = 70;
    const deltaBStart = 0;
    const deltaBEnd = 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('background', 'white');

    const xScale = d3.scaleLinear().domain([0, 40]).range([margin.left, width - margin.right]);
    const yScale = d3.scaleLinear().domain([0, 70]).range([height - margin.bottom, margin.top]);

    svg.selectAll('*').remove();

    const xAxis = d3.axisBottom(xScale).tickSizeOuter(6);
    const yAxis = d3.axisLeft(yScale).tickSizeOuter(6);

    svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    .call(yAxis)
    .selectAll('text') // Select all axis tick labels
    .attr('fill', 'black')
    .classed('noSelect', true)
    .style('font-size', '14px');

    svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text') // Select all axis tick labels
    .attr('fill', 'black') 
    .classed('noSelect', true)
    .style('font-size', '14px');

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width * 1.1 / 2)
    .attr("y", height - .2 * margin.bottom) // position below axis
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .classed('noSelect', true)
    .text("Δ / B");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", margin.left / 3) // position to the left of y-axis
    .attr("transform", `rotate(-90)`)
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .classed('noSelect', true)
    .text("E / B");

    // Plot free ion labels
    freeIonLabels.forEach(term => {
      svg.append('text')
        .attr('x', margin.left - 20)
        .attr('y', yScale(term.labelPosY) - 5 + term.labelAdjustY)
        .attr('fill', 'black')
        .style('font-size', '14px')
        .classed('noSelect', true)
        .text(term.label);
      }
    );

    // Plot curves
    terms.forEach(term => {
      term.color = term.color || 'black';

      const line = d3.line()
        .defined(d => term.fn(d) >= 0 && term.fn(d) <= yMax)
        .x(d => xScale(d))
        .y(d => yScale(term.fn(d)));

      // try and refactor
      if(term.allowedEnd) {
        svg.append('path')
          .datum(d3.range(deltaBStart, term.allowedEnd, 0.25))
          .attr('fill', 'none')
          .attr('stroke', term.color)
          .attr('stroke-width', 2)
          .attr('d', line);   
          
          svg.append('path')
            .datum(d3.range(term.allowedEnd, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4')
            .attr('d', line);

      } else if (term.allowedStart) {
        svg.append('path')
          .datum(d3.range(deltaBStart, term.allowedStart, 0.25))
          .attr('fill', 'none')
          .attr('stroke', 'gray')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4')
          .attr('d', line);
       
        svg.append('path')
          .datum(d3.range(term.allowedStart, deltaBEnd, 0.25))
          .attr('fill', 'none')
          .attr('stroke', term.color)
          .attr('stroke-width', 2)
          .attr('d', line);   
      } else {
        if(term.allowed) {
          svg.append('path')
            .datum(d3.range(deltaBStart, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', term.color)
            .attr('stroke-width', 2)
            .attr('d', line);
        } else {
          svg.append('path')
            .datum(d3.range(deltaBStart, deltaBEnd, 0.25))
            .attr('fill', 'none')
            .attr('stroke', 'gray')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4')
            .attr('d', line);
        }
      }

      if(terms.some(term => term.allowedStart || term.allowedEnd)) {
        svg.append('line')
          .attr('x1', xScale(terms[0].allowedStart || terms[0].allowedEnd))
          .attr('x2', xScale(terms[0].allowedStart || terms[0].allowedEnd))
          .attr('y1', margin.top - 15)
          .attr('y2', height - margin.bottom + 20)
          .attr('stroke', 'gray')
          .attr('stroke-width', 2)
          .style('pointer-events', 'none');
  
      }

      if(term.labelPosX) {
        svg.append('text')
          .attr('x', xScale(term.labelPosX) + term.labelAdjustX)
          .attr('y', yScale(term.fn(term.labelPosX)) + term.labelAdjustY)
          .attr('fill', term.color)
          .style('font-size', '14px')
          .classed('noSelect', true)
          .text(term.label);
      } else {
        svg.append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', yScale(term.fn(40)) - 5)
          .attr('fill', term.color)
          .style('font-size', '14px')
          .classed('noSelect', true)
          .text(term.label);
      }
    });

    // Vertical line
    const dragLine = svg.append('line')
      .attr('x1', xScale(deltaB))
      .attr('x2', xScale(deltaB))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style('pointer-events', 'none');

    function updateLine(pos) {
      const [mouseX] = d3.pointer(pos, svg.node());
      const boundedXVal = Math.max(margin.left, Math.min(width - margin.right, mouseX));
      setDeltaB(xScale.invert(boundedXVal));
    }

    svg.on('mousedown', () => {
      svg.on('mousemove', (event) => updateLine(event) );
    });

    svg.on('mouseup', () => {
      svg.on('mousemove', null);
    });

    svg.on("touchstart", (event) => {
      event.preventDefault(); // Prevent scrolling
      updateLine(event.touches[0]);
    })
    .on("touchmove", (event) => {
      event.preventDefault();
      updateLine(event.touches[0]);
    })
    

  }, [deltaB, config]);

  const terms = configs[config].terms;

  return (
    <div style={{ 
        backgroundColor: 'white',
        minHeight: '100vh',
        width: '100%',
        padding: '20px'
      }}>

    <div>
      <h2 style={{ color: 'black' }}>Tanabe-Sugano Diagram ({config})</h2>
      <div style={{ marginBottom: '10px', color: 'black' }}>
        <label>Select configuration: </label>
        <select value={config} onChange={e => setConfig(e.target.value)}>
          <option value="d2">d²</option>
          <option value="d7">d⁷</option>
        </select>
        <label>   Drag vertical line to reposition.</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
      <div style={{ 
        border: '2px solid #666',
        borderRadius: '4px',
        padding: '15px',
        display: 'inline-block',
        backgroundColor: 'white'
      }}>
        <svg ref={svgRef}></svg>
      </div>
      <div style={{ marginLeft: '20px', marginTop: '10px', color: 'black' }}>
        <strong>Δ/B:</strong> {deltaB.toFixed(2)}
        <ul>
          {terms.map(term => (
            <li key={term.label} style={{ color: (term.allowedEnd && deltaB > term.allowedEnd) || (term.allowedStart && deltaB < term.allowedStart) || !term.allowed ? 'black' : term.color }}>
              {term.label}: E/B = {Math.max(term.fn(deltaB).toFixed(2), 0)}
            </li>
          ))}
        </ul>
        <strong>ν₂/ν₁:</strong> {Math.max((terms[2].fn(deltaB) / terms[1].fn(deltaB)).toFixed(2), 0)}
      </div>
      </div>
    </div>
    </div>
  );
};

export default TanabeSuganoDiagram;
