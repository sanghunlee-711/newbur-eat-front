import GoogleMapReact from 'google-map-react';
import React, { useEffect, useState } from 'react';

interface ICoords {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lng: 0,
    lat: 0,
  });
  const [map, setMap] = useState<any>();
  const [maps, setMaps] = useState<any>();

  const onSuccess = ({
    coords: { latitude, longitude },
  }: GeolocationPosition) => {
    setDriverCoords({ lat: latitude, lng: longitude });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };

  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);

  useEffect(() => {
    if (map && maps) {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [driverCoords.lat, driverCoords.lng]);

  const onAPILoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map은 지금 당장의 정보
    //maps 는 GoogleMaps obj로 사용할 수 있는것임
    map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '50vh' }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onAPILoaded}
          defaultZoom={20}
          defaultCenter={{
            lat: 37.58,
            lng: 126.95,
          }}
          bootstrapURLKeys={{ key: 'AIzaSyCKwxwlpxO6KFUkXcNiWc0eVoWYJL19zJY' }}
        >
          <div
            //@ts-ignore
            lat={driverCoords.lat}
            lng={driverCoords.lng}
            className="text-lgl"
          >
            🚖
          </div>
        </GoogleMapReact>
      </div>
    </div>
  );
};
