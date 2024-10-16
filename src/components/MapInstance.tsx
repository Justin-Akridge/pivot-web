import { useJobContext } from '@/context/JobContext';
import { useState, useCallback, useEffect, memo, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { DistancePolyline } from './DistancePolyline';
import { Position } from '@/context/JobContext';

const MidspanIcon = (midspan: unknown, selectedMispan: Position | null) => {
  const scale = 4;
  const color = "blue";
  const opacity = 1;
  const isSelected = midspan === selectedMispan;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${scale * 4}" height="${scale * 4}">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/> <!-- Increased blur for a larger glow -->
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <polygon points="12,2 22,22 2,22" fill="${isSelected ? 'gold' : color}" fill-opacity="${opacity}" 
             stroke="black" stroke-width="2" ${isSelected ? `filter="url(#glow)"` : ''} />
  </svg>
`;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(scale * 4, scale * 4),
    anchor: new window.google.maps.Point(scale * 2, scale * 2)
  };
};

const MarkerIcon = (pole: Position, selectedPole: Position | null) => {
  const scale = 6;
  const color = "green";
  const opacity = 1;
  const isSelected = pole === selectedPole;
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${scale * 4}" height="${scale * 4}">
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="6" result="coloredBlur"/> <!-- Increased blur for a larger glow -->
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <circle cx="12" cy="12" r="${scale}" fill="${isSelected ? 'gold' : color}" fill-opacity="${opacity}" 
            stroke="black" stroke-width="3" ${isSelected ? `filter="url(#glow)"` : ''} />
  </svg>
`;

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(scale * 4, scale * 4),
    anchor: new window.google.maps.Point(scale * 2, scale * 2)
  };
};

const center = {
  lat: 39.58011852362521,
  lng: -86.03406644731625, 
};

const containerStyle = {
  width: '100%',
  height: '100%'
}


function MapInstance() {
  const {activeTool, poles, midspans, setMidspans, selectedMarker, setSelectedMarker} = useJobContext();
  const [map, setMap] = useState<google.maps.Map | null>(null)


  const mapOptionsCreator = useMemo(() => ({
    zoomControl: false,
    scaleControl: true,
    mapTypeId: 'hybrid',
    fullscreenControl: false,
    mapTypeControl: false,
    zoom: 2,
    minZoom: 3,
    tilt: 0,
    gestureHandling: 'greedy',
  }), []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API,
    libraries: ['geometry'],
  })

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback() {
    setMap(null)
  }, [])

  useEffect(() => {
    if (!map || !poles) return;
    const bounds = new window.google.maps.LatLngBounds();
    poles.forEach((pole: Position) => {
      bounds.extend(new window.google.maps.LatLng(pole.lat, pole.lng));
    });
    map.fitBounds(bounds);
  }, [map, poles]);

  function geographicToLocal(lat: number, lon: number, height: number) {
    const wgs84 = '+proj=longlat +datum=WGS84 +no_defs';
    const utmZone = '+proj=utm +zone=16 +datum=WGS84 +units=m +no_defs'; // Adjust the zone as needed

    //@ts-expect-error proj4 js lib
    const [x, y] = proj4(wgs84, utmZone, [lon, lat]);
    
    return { x, y, z: height };
  }

  const handleMarkerClick = (marker: Position) => {
    console.log("MAPINSTANCE", marker)
    if (activeTool === 'routing' && selectedMarker) {
      const midpoint = calculateMiddlePoint(marker, selectedMarker)
      const xyzMidspan = geographicToLocal(midpoint.lat, midpoint.lng, marker.z);
      const newMidspan = 
      [{
        midpoint: midpoint,
        x: xyzMidspan.x,
        y: xyzMidspan.y,
        z: xyzMidspan.z,
        pole1: { lat: marker.lat, lng: marker.lng }, 
        pole2: { lat: selectedMarker.lat, lng: selectedMarker.lng }, 
      }]
      
      if (!midspanExists(newMidspan)) {
        setMidspans([...midspans, newMidspan]);
      }
    }
    setSelectedMarker(marker)
  }

  const midspanExists = (newMidspan) => {
    return midspans.some(midspan => {
      return midspan[0].pole1.lat === newMidspan[0].pole1.lat &&
             midspan[0].pole1.lng === newMidspan[0].pole1.lng &&
             midspan[0].pole2.lat === newMidspan[0].pole2.lat &&
             midspan[0].pole2.lng === newMidspan[0].pole2.lng;
    });
  };


  interface Point {
    lat: number,
    lng: number
  }
  const calculateMiddlePoint = (start: Point, end: Point) => {
    return {
      lat: (start.lat + end.lat) / 2,
      lng: (start.lng + end.lng) / 2
    }
  }
  
  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={10}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={mapOptionsCreator}
    >
      { poles && 
        poles.map((pole: Position, index: number) => (
        <Marker 
          key={index}
          position={{lng: pole.lng, lat: pole.lat}}
          onClick={() => handleMarkerClick(pole)}
          icon={MarkerIcon(pole, selectedMarker)}
        />
      ))}

      {midspans && midspans.map((midspan, index) => (
        <DistancePolyline
          key={index}
          path={midspan[0]}
          strokeColor='red'
        />
      ))}

      {midspans && midspans.map((midspan, index) => (
        <Marker
          //@ts-expect-error type does not exist on marker
          type="midspan"
          key={index}
          position={calculateMiddlePoint(midspan[0].pole1, midspan[0].pole2)}
          icon={MidspanIcon(midspan[0], selectedMarker)} 
          onClick={() => handleMarkerClick(midspan[0])}
        />
      ))}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default memo(MapInstance);