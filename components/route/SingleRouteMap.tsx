import { RoutePoint } from '@/types/routes';

import React from 'react';
import { Marker, Polyline } from 'react-native-maps';

import { RouterMarker } from '@/components/route/parts/RouterMarker';

interface SingleRouteMapProps {
  points: RoutePoint[];
  color?: string;
  showMarkers?: boolean;
  showUserLocation?: boolean;
  style?: object;
  onPress?: () => void;
}

const SingleRouteMap: React.FC<SingleRouteMapProps> = ({
  points,
  color = 'red',
  onPress = () => {},
}) => {
  if (points.length === 0) return null;

  return (
    <>
      <Polyline
        coordinates={points.map(p => ({
          latitude: p.latitude,
          longitude: p.longitude,
        }))}
        strokeColor={color}
        strokeWidth={4}
      />
      {/* Start */}
      <Marker
        coordinate={{
          latitude: points[0].latitude,
          longitude: points[0].longitude,
        }}
        pinColor={color}
        title="Start"
        onPress={onPress}
      />
      {/* Finish */}
      {points.length > 1 && (
        <Marker
          coordinate={{
            latitude: points[points.length - 1].latitude,
            longitude: points[points.length - 1].longitude,
          }}
          pinColor={color}
          title="End"
          onPress={onPress}
        />
      )}
      {/* Path */}
      {points.slice(1, -1).map((point, i) => (
        <RouterMarker
          key={`${i}-${point.latitude}-${point.longitude}`}
          point={point}
          color={color}
          number={i + 1}
          onPress={onPress}
        />
      ))}

      {/* Path */}
      {/*{points.slice(1, -1).map(point => (*/}
      {/*  <React.Fragment key={point.latitude}>*/}
      {/*    <MapPoint*/}
      {/*      latitude={point.latitude}*/}
      {/*      longitude={point.longitude}*/}
      {/*      color={'red'}*/}
      {/*    />*/}
      {/*  </React.Fragment>*/}
      {/*))}*/}

      {/*<Marker*/}
      {/*  key={`${points[1].latitude}-${points[1].longitude}`}*/}
      {/*  coordinate={{*/}
      {/*    latitude: points[1].latitude,*/}
      {/*    longitude: points[1].longitude,*/}
      {/*  }}*/}
      {/*  anchor={{ x: 0.5, y: 0.5 }}*/}
      {/*  tracksViewChanges={false} // Улучшает производительность*/}
      {/*  title={'1'}*/}
      {/*>*/}
      {/*  <View style={[styles.markerContainer, { borderColor: 'black' }]}>*/}
      {/*    <View style={[styles.marker]}>*/}
      {/*      <Text style={styles.markerText}>{'1'}</Text>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*</Marker>*/}
    </>
  );
};

export default SingleRouteMap;

//
// import React from 'react';
// import { Marker, Polyline } from 'react-native-maps';
//
// import { RouterMarker } from '@/components/route/parts/RouterMarker';
//
// interface SingleRouteMapProps {
//   points: RoutePoint[];
//   color?: string;
//   showMarkers?: boolean;
//   showUserLocation?: boolean;
//   style?: object;
// }
//
// const SingleRouteMap: React.FC<SingleRouteMapProps> = ({
//   points,
//   color = 'red',
// }) => {
//   if (points.length === 0) return null;
//
//   return (
//     <>
//       <Polyline
//         coordinates={points.map(p => ({
//           latitude: p.latitude,
//           longitude: p.longitude,
//         }))}
//         strokeColor={color}
//         strokeWidth={4}
//       />
//       {/* Start */}
//       <Marker
//         coordinate={{
//           latitude: points[0].latitude,
//           longitude: points[0].longitude,
//         }}
//         pinColor={color}
//         title="Start"
//       />
//       {/* Finish */}
//       {points.length > 1 && (
//         <Marker
//           coordinate={{
//             latitude: points[points.length - 1].latitude,
//             longitude: points[points.length - 1].longitude,
//           }}
//           pinColor={color}
//           title="End"
//         />
//       )}
//       {/* Path */}
//       {points.slice(1, -1).map((point, i) => (
//         <RouterMarker
//           key={`${i}-${point.latitude}-${point.longitude}`}
//           point={point}
//           color={color}
//           number={i + 1}
//         />
//       ))}
//
//       {/* Path */}
//       {/*{points.slice(1, -1).map(point => (*/}
//       {/*  <React.Fragment key={point.latitude}>*/}
//       {/*    <MapPoint*/}
//       {/*      latitude={point.latitude}*/}
//       {/*      longitude={point.longitude}*/}
//       {/*      color={'red'}*/}
//       {/*    />*/}
//       {/*  </React.Fragment>*/}
//       {/*))}*/}
//
//       {/*<Marker*/}
//       {/*  key={`${points[1].latitude}-${points[1].longitude}`}*/}
//       {/*  coordinate={{*/}
//       {/*    latitude: points[1].latitude,*/}
//       {/*    longitude: points[1].longitude,*/}
//       {/*  }}*/}
//       {/*  anchor={{ x: 0.5, y: 0.5 }}*/}
//       {/*  tracksViewChanges={false} // Улучшает производительность*/}
//       {/*  title={'1'}*/}
//       {/*>*/}
//       {/*  <View style={[styles.markerContainer, { borderColor: 'black' }]}>*/}
//       {/*    <View style={[styles.marker]}>*/}
//       {/*      <Text style={styles.markerText}>{'1'}</Text>*/}
//       {/*    </View>*/}
//       {/*  </View>*/}
//       {/*</Marker>*/}
//     </>
//   );
// };
//
// export default SingleRouteMap;
