import { HeatmapLayer } from "@deck.gl/aggregation-layers/typed";

import { DataProps } from "./App";

export const RenderLayers = (props: DataProps) => {
  const records = props.records
    .flatMap((record) => record)
    .filter((record) => record.geometry);
  const layers = [
    new HeatmapLayer({
      id: "air-quality-data",
      data: records,
      getPosition: (d) => d.geometry.coordinates,
      getRadius: (d: { fields: { measurement_value: number } }) =>
        d.fields.measurement_value,
      colorRange: [
        [255, 255, 204],
        [199, 233, 180],
        [127, 205, 187],
        [65, 182, 196],
        [44, 127, 184],
        [37, 52, 148],
      ], // 6-class YlGnBu
      extruded: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      radiusScale: 3,
      radiusMinPixels: 10,
      radiusMaxPixels: 100,
      lineWidthMinPixels: 1,
      intensity: 2,
      pickable: true, //  identify an object and the layer it's in
      // onHover: props.onHover,
    }),
  ];

  return layers;
};
