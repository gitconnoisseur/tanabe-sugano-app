import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

const configs = {
  'd2': { terms: [
      { label: '3T1g(F)', color: 'steelblue', allowed: true, fn: (x) => 0 },
      { label: '3T2g(F)', color: 'orange', allowed: true, fn: (x) => 0.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3A2g(F)', labelPosX: 35, labelAdjustX: 0, labelAdjustY: -30, color: 'green', allowed: true, fn: (x) => 1.8286*x + 0.005146*x**2 - 0.00005798*x**3 },
      { label: '3T1g(P)', color: 'purple', allowed: true, fn: (x) => 14.864 + 0.6827*x + 0.009024*x**2 - 0.00009750*x**3 },
      { label: '1T2g(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: 20, allowed: false, fn: (x) => 13.852 + 0.3724*x - 0.03294*x**2 +0.001387*x**3 -0.00002830*x**4 + 2.2359*(10**-7)*x**5 },
      { label: '1Eg(D)', labelPosX: 10, labelAdjustX: 0, labelAdjustY: -10, allowed: false, fn: (x) => 13.84 + 0.7374*x -0.08559*x**2 +0.004311*x**3 -0.00009952*x**4 + 8.5933*(10**-7)*x**5 },
      { label: '1T2g(G)', allowed: false, fn: (x) => 20.84 + 0.2285*x +0.05275*x**2 -0.002032*x**3 +0.00003996*x**4 -3.1056*(10**-7)*x**5 },
      { label: '1Eg(G)', labelPosX: 27, labelAdjustX: 0, labelAdjustY: -20, allowed: false, fn: (x) => 20.84 + 0.8688*x +0.1047*x**2 -0.004917*x**3 +0.0001102*x**4 -9.3770*(10**-7)*x**5 },
      { label: '1T1g(G)', allowed: false, fn: (x) => 20.84 + 0.8031*x +0.009562*x**2 -0.0003032*x**3 +5.3568*10**-6*x**4 -3.9187*(10**-8)*x**5 },
      { label: '1A1g(G)', allowed: false, fn: (x) => 20.84 + 1.0286*x -0.02882*x**2 +0.0001739*x**3 +7.2070*10**-6*x**4 -1.062*(10**-7)*x**5 },
      { label: '1A1g(S)', labelPosX: 14, labelAdjustX: -5, labelAdjustY: -20, allowed: false, fn: (x) => 52.94 + 0.5774*x +0.04798*x**2 -0.0007824*x**3 +3.5591*10**-6*x**4 +2.7330*(10**-7)*x**5 },
    ], freeIonLabels: [
      { label: '1S', labelPosY: 52.94, labelAdjustY: 5 },
      { label: '1G', labelPosY: 20.84, labelAdjustY: 5 },
      { label: '3P', labelPosY: 15, labelAdjustY: 0 },
      { label: '3F', labelPosY: 0, labelAdjustY: -5 },
      { label: '1D', labelPosY: 13.84, labelAdjustY: -5 },
      // CHECK ON THESE
    ]},
  'd3': { terms: [
    { label: '4A2g(F)', color: 'steelblue', fn: (x) => 18 + 0.3 * x - 0.015 * x ** 2 },
    { label: '4T2g(F)', color: 'orange', fn: (x) => 12 + 0.45 * x },
    { label: '4T1g(F)', color: 'green', fn: (x) => 6 + 0.12 * x + 0.003 * x ** 2 },
    { label: '4T1g(P)', color: 'purple', fn: (x) => 28 + 0.35 * x },
  ], freeIonLabels: [

  ]},
};

const TanabeSuganoDiagram = () => {
  const svgRef = useRef();
  const [deltaB, setDeltaB] = useState(25);
  const [config, setConfig] = useState('d2');

  useEffect(() => {
    const terms = configs[config].terms;
    const freeIonLabels = configs[config].freeIonLabels;
    const width = 640;
    const height = 900;
    const margin = { top: 20, right: 40, bottom: 60, left: 60 };
    const yMax = 70;

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
    .style('font-size', '14px');

    svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(xAxis)
    .selectAll('text') // Select all axis tick labels
    .attr('fill', 'black') 
    .style('font-size', '14px');

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", width * 1.1 / 2)
    .attr("y", height - .2 * margin.bottom) // position below axis
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .text("Δ / B");

    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -height / 2)
    .attr("y", margin.left / 3) // position to the left of y-axis
    .attr("transform", `rotate(-90)`)
    .attr("font-weight", "bold")
    .style("font-size", "18px")
    .text("E / B");

    // plot free ion labels
    freeIonLabels.forEach(term => {
      svg.append('text')
        .attr('x', margin.left - 20)
        .attr('y', yScale(term.labelPosY) - 5 + term.labelAdjustY)
        .attr('fill', 'black')
        .style('font-size', '12px')
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

      if(term.allowed) {
        svg.append('path')
          .datum(d3.range(0, 40, 0.5))
          .attr('fill', 'none')
          .attr('stroke', term.color)
          .attr('stroke-width', 2)
          .attr('d', line);
      } else {
        svg.append('path')
          .datum(d3.range(0, 40, 0.5))
          .attr('fill', 'none')
          .attr('stroke', 'gray')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4')
          .attr('d', line);
      }

      if(term.labelPosX) {
        svg.append('text')
          .attr('x', xScale(term.labelPosX) + term.labelAdjustX)
          .attr('y', yScale(term.fn(term.labelPosX)) + term.labelAdjustY)
          .attr('fill', term.color)
          .style('font-size', '12px')
          .text(term.label);
      } else {
        svg.append('text')
          .attr('x', width - margin.right - 10)
          .attr('y', yScale(term.fn(40)) - 5)
          .attr('fill', term.color)
          .style('font-size', '12px')
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

    const onMouseMove = (event) => {
      const [mouseX] = d3.pointer(event);
      const clampedX = Math.max(margin.left, Math.min(width - margin.right, mouseX));
      const newDeltaB = xScale.invert(clampedX);
      setDeltaB(newDeltaB);
    };

    svg.on('mousedown', () => {
      svg.on('mousemove', onMouseMove);
    });

    svg.on('mouseup', () => {
      svg.on('mousemove', null);
    });

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
        <label>Select Configuration: </label>
        <select value={config} onChange={e => setConfig(e.target.value)}>
          <option value="d2">d²</option>
          <option value="d3">d³</option>
        </select>
      </div>
      <div style={{ 
        border: '2px solid #666',
        borderRadius: '4px',
        padding: '15px',
        display: 'inline-block',
        backgroundColor: 'white'
      }}>
        <svg ref={svgRef}></svg>
      </div>
      <div style={{ marginTop: '10px', color: 'black' }}>
        <strong>Δ/B:</strong> {deltaB.toFixed(2)}
        <ul>
          {terms.map(term => (
            <li key={term.label} style={{ color: term.color }}>
              {term.label}: E/B = {term.fn(deltaB).toFixed(2)}
            </li>
          ))}
        </ul>
        <strong>ν₂/ν₁:</strong> {(terms[1].fn(deltaB) / terms[0].fn(deltaB)).toFixed(2)}
      </div>
    </div>
    </div>
  );
};

export default TanabeSuganoDiagram;
