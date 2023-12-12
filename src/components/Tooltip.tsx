import { selectAll } from "d3";

type TooltipProps = {
  values?: Record<string, number>;
  leftOffset: number;
};

export const Tooltip = ({ values, leftOffset }: TooltipProps) => {
  const lines = selectAll(".path").nodes() as SVGPathElement[];
  const strokes = lines.map((line) => line.getAttribute("stroke") as string);
  return (
    <div
      className="tooltip"
      style={{
        left: values ? leftOffset : 0,
        opacity: values ? 1 : 0,
      }}
    >
      <ul
        style={{
          visibility: values ? "visible" : "hidden",
        }}
      >
        {Object.entries(values || {}).map(([key, value], i) => {
          return (
            <li key={key} style={{ color: strokes[i] }}>
              <span>
                {key}: {value}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
