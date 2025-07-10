"use client";

import React from "react";
import * as d3 from "d3";

export interface ChordChartProps {
    matrix: number[][];
    labels: string[];
    width?: number;
    height?: number;
}

export const ChordChart: React.FC<ChordChartProps> = ({ matrix, labels, width = 200, height = 200 }) => {
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 20;

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);
    const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    const ribbon = d3.ribbon().radius(innerRadius);
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const chords = chord(matrix);

    return (
        <svg viewBox={[-width / 2, -height / 2, width, height].join(" ")}>
            {/* Groups (Arcs) */}
            <g>
                {chords?.groups?.map((d, i) => (
                    <g key={i}>
                        <path d={arc(d) as string} fill={color(i.toString()) as string} stroke="#000" />
                        <text
                            transform={`rotate(${((d.startAngle + d.endAngle) / 2) * (180 / Math.PI) - 90}) 
                          translate(${outerRadius + 10})
                          ${(d.startAngle + d.endAngle) / 2 > Math.PI ? "rotate(180)" : ""}`}
                            dy=".35em"
                            textAnchor={(d.startAngle + d.endAngle) / 2 > Math.PI ? "end" : "start"}
                            fontSize="6"
                            fill="black"
                        >
                            {labels[i]}
                        </text>
                    </g>
                ))}
            </g>

            {/* Ribbons (Connections) */}
            <g>
                {chords.map((d, i) => (
                    <path key={i} d={ribbon(d) as string} fill={color(d.source.index.toString()) as string} stroke="#000" opacity={0.7} />
                ))}
            </g>
        </svg>
    );
};
