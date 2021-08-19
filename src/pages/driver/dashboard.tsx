import { useSubscription } from '@apollo/client';
import GoogleMapReact from 'google-map-react';
import gql from 'graphql-tag';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FULL_ORDER_FRAGMENT } from '../../fragments';
import { cookedOrders } from '../../__generated__/cookedOrders';

const COOCKED_ORDERS_SUBSCRIPTION = gql`
  subscription cookedOrders {
    cookedOrders {
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`;

interface ICoords {
  lat: number;
  lng: number;
}

interface IDriverProps {
  lat: number;
  lng: number;
  $hover?: any;
}

const Driver: React.FC<IDriverProps> = () => <div className="text-lg">🚖</div>;

export const Dashboard = () => {
  const [driverCoords, setDriverCoords] = useState<ICoords>({
    lng: 0,
    lat: 0,
  });
  const [map, setMap] = useState<google.maps.Map>();
  const [maps, setMaps] = useState<any>();
  const [to, setTo] = useState<ICoords>({
    lng: 0,
    lat: 0,
  });
  const { data: coockedOrdersData } = useSubscription<cookedOrders>(
    COOCKED_ORDERS_SUBSCRIPTION
  );

  useEffect(() => {
    if (coockedOrdersData?.cookedOrders.id) {
      makeRoute();
    }
  }, [coockedOrdersData]);

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
    //geocoding -> 주소 => lat, lng
    // reverse_geocoding -> lat, lng => 주소
    if (map && maps) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
      const geoCoder = new google.maps.Geocoder();
      // geoCoder.geocode(
      //   {
      //     address: coockedOrdersData?.cookedOrders.customer?.address,
      //   },
      //   (results, status) => {
      //     setTo({
      //       lat: results[0].geometry.location.lat() || driverCoords.lat + 0.05,
      //       lng: results[0].geometry.location.lng() || driverCoords.lng + 0.05,
      //     });
      //     console.log(status, results);
      //   }
      // );

      geoCoder.geocode(
        {
          location: new google.maps.LatLng(driverCoords.lat, driverCoords.lng),
        },
        (results, status) => {
          console.log(status, results);
        }
      );
    }
  }, [driverCoords.lat, driverCoords.lng]);

  useEffect(() => {
    if (map && maps) {
      console.log('??', coockedOrdersData?.cookedOrders.customer?.address);

      const geoCoder = new google.maps.Geocoder();
      geoCoder.geocode(
        {
          address: coockedOrdersData?.cookedOrders.customer?.address,
        },
        (results, status) => {
          setTo({
            lat: results[0].geometry.location.lat() || driverCoords.lat + 0.05,
            lng: results[0].geometry.location.lng() || driverCoords.lng + 0.05,
          });
          console.log(status, results);
        }
      );
    }
  }, [coockedOrdersData?.cookedOrders.customer]);

  const onAPILoaded = ({ map, maps }: { map: any; maps: any }) => {
    //map은 지금 당장의 정보
    //maps 는 GoogleMaps obj로 사용할 수 있는것임
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    setMap(map);
    setMaps(maps);
  };

  const makeRoute = () => {
    if (map) {
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer({
        polylineOptions: {
          strokeColor: '#000',
          strokeOpacity: 0.7,
          strokeWeight: 7,
        },
      });
      directionsRenderer.setMap(map);
      directionsService.route(
        {
          origin: {
            location: new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            ),
          },
          destination: {
            location: new google.maps.LatLng(to.lat, to.lng),
          },
          travelMode: google.maps.TravelMode.TRANSIT,
        },
        (result, status) => {
          directionsRenderer.setDirections(result);
        }
      );
    }
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
            lat: 36.58,
            lng: 125.95,
          }}
          bootstrapURLKeys={{
            key: process.env.REACT_APP_GOOGLE_MAP_API_KEY || '',
          }}
        >
          <Driver lat={driverCoords.lat} lng={driverCoords.lng} />
        </GoogleMapReact>
      </div>
      <div className="max-w-screen-sm  mx-auto bg-white  relative -top-10 shadow-lg py-8 px-5">
        {coockedOrdersData?.cookedOrders ? (
          <>
            <h1 className="text-center text-3xl font-medium">
              New Coocked Order
            </h1>
            <h4 className="text-center text-2xl font-medium my-3">
              Pick it up soon @
              {coockedOrdersData?.cookedOrders.restaurant?.name}
            </h4>
            <Link
              to={`/orders/${coockedOrdersData?.cookedOrders.id}`}
              className="btn w-full mt-5 block text-center"
            >
              Accept Challenge &rarr;
            </Link>
          </>
        ) : (
          <h1 className="text-center text-3xl font-medium">No orders yet...</h1>
        )}
      </div>
    </div>
  );
};
