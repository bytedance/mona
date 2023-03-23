import { bubbleEventsAlias, basePropAlias, propAliasMap } from '../prop';
import { MapAlias as Alias } from '../type';

const alias: Alias = {
  ...basePropAlias,
  ...bubbleEventsAlias,
  latitude: propAliasMap.latitude,
  longtitude: propAliasMap.longtitude,
  scale: propAliasMap.scale,
  markers: propAliasMap.markers,
  circles: propAliasMap.circles,
  showLocation: propAliasMap.showLocation,
  polyline: propAliasMap.polyline,
  includePoints: propAliasMap.includePoints,
  onTap: propAliasMap.onTap,
  onMarkerTap: propAliasMap.onMarkerTap,
  onCalloutTap: propAliasMap.onCalloutTap,
  onRegionChange: propAliasMap.onRegionChange,
  // rotate: propAliasMap.rotate,
  // skew: propAliasMap.onStop,
  // showCompass: propAliasMap.showCompass,
  // enableOverlooking: propAliasMap.devicePosition,
  // enableRotate: propAliasMap.enableRotate,
};

export default alias;
