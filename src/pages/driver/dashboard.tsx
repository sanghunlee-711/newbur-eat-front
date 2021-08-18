import GoogleMapReact from 'google-map-react';
import React from 'react';

export const Dashboard = () => {
  return (
    <div>
      <div
        className="overflow-hidden"
        style={{ width: window.innerWidth, height: '95vh' }}
      >
        <GoogleMapReact
          defaultZoom={20}
          defaultCenter={{
            lat: 59.95,
            lng: 30.0,
          }}
          bootstrapURLKeys={{ key: 'AIzaSyCQ_KSVPaT_m6QxR2VtfduCpTBk1tn7-RE' }}
        >
          <h1>Hello</h1>
        </GoogleMapReact>
      </div>
    </div>
  );
};
