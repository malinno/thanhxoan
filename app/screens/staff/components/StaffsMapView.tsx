import HStack from '@app/components/HStack';
import { DEFAULT_MAP_REGION } from '@app/constants/map.constant';
import useGeolocation from '@app/hooks/useGeolocation';
import { useStaffsMapState } from '@app/hooks/useStaffsMapState';
import MyAvatar from '@core/components/MyAvatar';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from 'react-native-maps';

const StaffsMapView = () => {
  const { geolocation } = useGeolocation(false);

  const [currentPosition, setCurrentPosition] =
    useState<Region>(DEFAULT_MAP_REGION);

  const onlineStaffs = useStaffsMapState(state => state.onlineStaffs);

  useEffect(() => {
    if (!geolocation) return;

    setCurrentPosition(state => ({
      ...state,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
    }));
  }, [geolocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        region={currentPosition}
        provider={PROVIDER_GOOGLE}
        showsMyLocationButton
        showsUserLocation
        tintColor={colors.primary}>
        {onlineStaffs?.map(s => {
          if (!s.latitude || !s.longitude) return null;
          const _onPress = () => {};
          return (
            <Marker
              key={s.id}
              onPress={_onPress}
              coordinate={{
                latitude: parseFloat(s.latitude),
                longitude: parseFloat(s.longitude),
                // latitude: 20.992543,
                // longitude: 105.8017148,
              }}
              calloutOffset={{ x: -8, y: 28 }}
              calloutAnchor={{ x: 0.5, y: -0.2 }}>
              <View style={styles.marker}>
                <View style={styles.dot} />
              </View>
              <Callout onPress={() => {}} tooltip={true}>
                <HStack style={styles.callout}>
                  <MyAvatar
                    src={
                      Boolean(s.image_url) ? { uri: s.image_url } : undefined
                    }
                    name={s.user_id?.name}
                    style={styles.avatar}
                    size={31}
                  />
                  <View style={styles.user}>
                    <Text numberOfLines={1} style={styles.name}>
                      {s.user_id?.name}
                    </Text>
                    {/* {!isEmpty(s.position?.[1].trim()) && (
                      <Text style={styles.position}>{s.position[1]}</Text>
                    )} */}
                  </View>
                </HStack>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
};

export default StaffsMapView;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  marker: {
    borderWidth: 2,
    borderColor: 'transparent',
    // borderColor: colors.red,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.color06AD0C,
  },
  callout: {
    backgroundColor: colors.white,
    borderRadius: 12,
    width: 200,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#eaecef',
  },
  avatar: {},
  user: {
    flex: 1,
    marginLeft: 8,
    // backgroundColor: 'red',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
  },
  position: {
    color: colors.color6B7A90,
    marginTop: 6,
  },
});
