'use client';

import Map, { Marker } from "react-map-gl/mapbox";
import 'mapbox-gl/dist/mapbox-gl.css';

type Props = {
  lat: number;
  lng: number;
};

export default function MapWrapper({ lat, lng }: Props) {
  return (
    <div className="h-[400px] rounded overflow-hidden">
      <Map
        initialViewState={{
          longitude: lng,
          latitude: lat,
          zoom: 12,
        }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <Marker longitude={lng} latitude={lat} color="red" />
      </Map>
    </div>
  );
}