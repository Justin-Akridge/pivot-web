import { Polyline, OverlayView } from '@react-google-maps/api';

export const DistancePolyline = ({ path, strokeColor}: any ) => {
  const calculateMiddlePoint = (start, end) => ({
    lat: (start.lat + end.lat) / 2 - 0.00002,
    lng: (start.lng + end.lng) / 2
  });

  const start = new window.google.maps.LatLng(path.pole1.lat, path.pole1.lng);
  const end = new window.google.maps.LatLng(path.pole2.lat, path.pole2.lng);

  const distanceMeters = window.google.maps.geometry.spherical.computeDistanceBetween(start, end);
  const distanceFeet = distanceMeters * 3.28084;
  const middlePoint = calculateMiddlePoint(path.pole1, path.pole2);

  const midspan = {
    distance: distanceFeet,
    middlePoint
  };
  

  const newPath = [
    { lat: path.pole1.lat, lng: path.pole1.lng },
    { lat: path.pole2.lat, lng: path.pole2.lng }
  ];

  return (
     <>
        <Polyline path={newPath} options={{ strokeColor: strokeColor, strokeWeight: 6 }} />
          <OverlayView
              position={midspan.middlePoint}
              mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <div className="fixed w-fit bg-white opacity-60 rounded-md text-black p-1">
              {midspan.distance ? `${midspan.distance.toFixed(0)}'` : `${midspan.distance.toFixed(0)}'`}
            </div>
        </OverlayView>
      </>
  );
};
