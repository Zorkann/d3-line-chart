import { ScaleLinear } from "d3-scale";
import { memo } from "react";

type AxisLeftProps = {
  yScale: ScaleLinear<number, number, never>;
  innerWidth: number;
  tickOffset: number;
  lineOffset: number;
};

export const AxisLeft = memo(
  ({
    yScale,
    innerWidth = 0,
    tickOffset = 0,
    lineOffset = 0,
  }: AxisLeftProps) => (
    <g className="axis-left">
      {yScale.ticks().map((tickValue) => (
        <g
          className="tick"
          key={tickValue}
          transform={`translate(${-lineOffset},${yScale(tickValue)})`}
        >
          <line x2={innerWidth + lineOffset} />
          <text
            key={tickValue}
            style={{ textAnchor: "end" }}
            x={-tickOffset}
            dy=".32em"
          >
            {tickValue}
          </text>
        </g>
      ))}
    </g>
  )
);

AxisLeft.displayName = "AxisLeft";
