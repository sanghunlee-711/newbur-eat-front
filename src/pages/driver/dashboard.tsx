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

  const onAPILoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map은 지금 당장의 정보
    //maps 는 GoogleMaps obj로 사용할 수 있는것임
    setTimeout(() => {
      map.panTo(new maps.LatLng(driverCoords.lat, driverCoords.lng));
    }, 2000);
  };

  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '95vh' }}
      >
        <GoogleMapReact
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onAPILoaded}
          defaultZoom={15}
          defaultCenter={{
            lat: 37.58,
            lng: 126.95,
          }}
          bootstrapURLKeys={{ key: 'AIzaSyCKwxwlpxO6KFUkXcNiWc0eVoWYJL19zJY' }}
        ></GoogleMapReact>
      </div>
    </div>
  );
};
