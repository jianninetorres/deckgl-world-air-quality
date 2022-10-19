import React, { useEffect, useState } from "react";
import DeckGL from "@deck.gl/react/typed";
import StaticMap from "react-map-gl";
import { RenderLayers } from "./deckgl-layers";

import axios from "axios";

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_ACCESS_TOKEN;
const mapStyle = "mapbox://styles/jtorlesp/cl51tnhls004b14qfsua2jxy2";

export type FeatureType = "Point" | "Feature";
type Coordinates = [number, number];

interface Record {
  datasetid: string;
  recordid: string;
  fields: {
    [key: string]: string | Coordinates;
  };
  geometry: {
    type: FeatureType;
    coordinates: Coordinates;
  };
}

interface Facet {
  name: string;
  count: number;
  state: string;
  path: string;
}

interface FacetGroup {
  name: string;
  facets: Facet[];
}

export interface DataProps {
  nhits: number;
  parameters: {
    dataset: string;
    rows: number;
    start: number;
    facet: string[];
    format: "json";
    timezone: string;
  };
  records: Record[];
  facet_groups: FacetGroup[];
}

const App = () => {
  const [data, setData] = useState<DataProps>({
    nhits: 0,
    parameters: {
      dataset: "",
      rows: 0,
      start: 0,
      facet: [""],
      format: "json",
      timezone: "",
    },
    records: [],
    facet_groups: [],
  });

  const fetchData = async () => {
    try {
      return await axios
        .get(
          "https://public.opendatasoft.com/api/records/1.0/search/?dataset=openaq&q=&rows=6000&facet=country&facet=city&facet=location&facet=measurements_parameter&facet=measurements_sourcename&facet=measurements_lastupdated"
        )
        .then((res) => {
          let _data = res.data as DataProps;
          setData(_data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  const INITIAL_VIEW_STATE = {
    longitude: 0,
    latitude: 20,
    zoom: 1.5,
    maxZoom: 16,
    minZoom: 2,
    pitch: 20, // map angle; 0 = top-down view
    bearing: 0, // direction it. North = 0
  };

  return (
    <div>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={RenderLayers(data)}
      >
        <StaticMap
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    </div>
  );
};
export default App;
