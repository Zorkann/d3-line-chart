import { ScaleLinear } from "d3-scale";
import { line, curveCardinal, select } from "d3";
import { useMemo } from "react";

const animateLine = async (ref: SVGPathElement) => {
  const totalLength = ref.getTotalLength().toFixed() || "";
  const path = select(ref);

  await path
    .attr("stroke-dasharray", totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(2000)
    .attr("stroke-dashoffset", 0)
    .end();

  await path.attr("stroke-dasharray", 0).transition().end();
};

type LineProps = {
  data: number[];
  xScale: ScaleLinear<number, number, never>;
  yScale: ScaleLinear<number, number, never>;
  stroke: string;
  selectedPoint: number;
};

export const Line = ({
  data,
  xScale,
  yScale,
  stroke = "black",
  selectedPoint,
}: LineProps) => {
  const linePath = useMemo(
    () =>
      line()
        .x((_, i) => xScale(i))
        .y((d) => yScale(d))
        .curve(curveCardinal)(data),
    [data, xScale, yScale]
  );

  return (
    <g className="line">
      <path
        ref={animateLine}
        className="path"
        fill="none"
        stroke={stroke}
        d={linePath}
      />

      <g className="marks">
        {data.map((d, i) => (
          <circle
            className="circle"
            fill={selectedPoint === i ? stroke : "white"}
            stroke={stroke}
            key={i}
            cx={xScale(i)}
            cy={yScale(d)}
            r={selectedPoint === i ? 6 : 4}
          />
        ))}
      </g>
    </g>
  );
};
