import {
  BOTTOM_SPACING,
  BUTTON_SIZE,
  DEFAULT_LATITUDE,
  DEFAULT_LATITUDE_DELTA,
  DEFAULT_LONGITUDE,
  DEFAULT_LONGITUDE_DELTA,
  MARKER_SIZE,
} from '@app/constants/map.constant';
import { SCREEN } from '@app/enums/screen.enum';
import useGeolocation from '@app/hooks/useGeolocation';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button, { AnimatedButton } from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import PlaceUtils from '@core/utils/PlaceUtils';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CancelTokenSource } from 'axios';
import { isNil } from 'lodash';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Keyboard, Platform, StyleSheet, View } from 'react-native';
import {
  AutocompleteDropdown,
  AutocompleteDropdownRef,
  TAutocompleteDropdownItem,
} from 'react-native-autocomplete-dropdown';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';
import MapView, {
  Details,
  Marker,
  PROVIDER_GOOGLE,
  Region,
  UserLocationChangeEvent,
} from 'react-native-maps';
import Animated, {
  Easing,
  Extrapolate,
  FadeIn,
  FadeInDown,
  FadeOutDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Geolocation, {
  GeoError,
  GeoOptions,
  GeoPosition,
} from 'react-native-geolocation-service';

const INIT_REGION = {
  latitude: DEFAULT_LATITUDE,
  longitude: DEFAULT_LONGITUDE,
  latitudeDelta: DEFAULT_LATITUDE_DELTA,
  longitudeDelta: DEFAULT_LONGITUDE_DELTA,
};

export type TLocation = {
  address?: string;
  latitude: number;
  longitude: number;
};

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.MAP>;

const MapScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const {
    readOnlyMode,
    location,
    onLocation,
    screenTitle,
    confirmText,
    ...mapViewProps
  } = route.params;

  const { geolocation } = useGeolocation(false);

  const [isFocus, setIsFocus] = useState(false);
  const [address, setAddress] = useState(location);
  const [panning, setPanning] = useState(false);
  const [places, setPlaces] = useState<any[]>([]);
  const [region, setRegion] = useState<Region>({
    ...INIT_REGION,
    ...location,
  });

  const _markerAnimation = useSharedValue(0);

  const _dropdownRef = useRef<AutocompleteDropdownRef | null>(null);
  const _mapView = useRef<MapView>(null);
  const _userLocation = useRef<Region>(INIT_REGION);

  useEffect(() => {
    if (!geolocation) return;

    _userLocation.current = {
      ..._userLocation.current,
      latitude: geolocation.coords.latitude,
      longitude: geolocation.coords.longitude,
    };
  }, [geolocation]);

  useEffect(() => {
    if (!location?.address) _fetchPlace(region);
  }, []);

  useEffect(() => {
    const keyboardDismissListener =
      Platform.OS === 'android'
        ? Keyboard.addListener('keyboardDidHide', event => setIsFocus(false))
        : undefined;
    return () => {
      keyboardDismissListener?.remove();
    };
  }, []);

  useEffect(() => {
    if (address?.address) _dropdownRef.current?.setInputText(address?.address);
  }, [address]);

  useEffect(() => {
    if (panning) {
      markerUp();
      setAddress(undefined);
      setPlaces([]);
      _dropdownRef.current?.setInputText(t('common.searching').concat(' ...'));
    } else markerDown();
  }, [panning]);

  const markerUp = () => {
    _markerAnimation.value = withTiming(1, {
      duration: 300,
      easing: Easing.linear,
    });
  };

  const markerDown = () => {
    _markerAnimation.value = withTiming(0, {
      duration: 300,
    });
  };

  const _onPanDrag = () => {
    if (readOnlyMode) {
      return;
    }

    setPanning(true);
    setAddress(undefined);
    Keyboard.dismiss();
    _dropdownRef.current?.close();
  };

  const fetchSuggestions = useCallback(async (q: string) => {
    const places = await PlaceUtils.searchPlace(
      q,
      region.latitude,
      region.longitude,
    );
    // const places = response?.data?.data || [];
    setPlaces(places);
  }, []);

  const _onRegionChanged = async (region: Region, details: Details) => {
    setPanning(false);
    setRegion(region);

    if (isNil(address)) _fetchPlace(region);
  };

  const _onUserLocationChange = (event: UserLocationChangeEvent) => {
    if (event.nativeEvent.coordinate) {
      _userLocation.current = {
        ..._userLocation.current,
        latitude: event.nativeEvent.coordinate?.latitude,
        longitude: event.nativeEvent.coordinate?.longitude,
      };
    }
  };

  const onPressMyLocation = () => {
    if (!_userLocation.current) {
      Geolocation.getCurrentPosition(({ coords }) => {
        _userLocation.current = {
          ..._userLocation.current,
          latitude: coords?.latitude,
          longitude: coords?.longitude,
        };
        _mapView.current?.animateToRegion(_userLocation.current);
      });
      return;
    }

    setAddress(undefined);
    _mapView.current?.animateToRegion(_userLocation.current);
  };

  const _fetchPlace = async (region: Region) => {
    const address = await PlaceUtils.location2String(
      region.latitude,
      region.longitude,
    );

    setAddress({
      address: address || '',
      latitude: region.latitude,
      longitude: region.longitude,
    });
  };

  const _onPressSuggestion = (suggestion: TAutocompleteDropdownItem) => {
    if (!suggestion) return;
    const address = places[Number(suggestion.id)];
    setAddress(address);
    _mapView.current?.animateCamera({
      center: {
        latitude: address.latitude,
        longitude: address.longitude,
      },
    });
  };

  const onClearPress = useCallback(() => {
    setAddress(undefined);
    setPlaces([]);
    _dropdownRef.current?.open();
  }, []);

  const _submit = () => {
    if (!address) return;

    onLocation?.(address);
    navigation.goBack();
  };

  const _renderItem = (item: TAutocompleteDropdownItem, _: string) => (
    <View style={styles.suggestionItem}>
      <Image source={images.common.search} />
      <Text style={styles.suggestionItemText}>{item.title}</Text>
    </View>
  );

  // const initRegion = location ? { ...location, latitudeDelta, longitudeDelta } : INIT_REGION

  const markerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            _markerAnimation.value,
            [0, 1],
            [0, -15],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const shadowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        ...styles.shadow.transform,
        {
          scale: interpolate(
            _markerAnimation.value,
            [0, 1],
            [1, 0.5],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  const suggestions: TAutocompleteDropdownItem[] = places?.map(
    (place, idx) => ({ id: String(idx), title: place.address }),
  );

  return (
    <>
      <Header title={screenTitle || t('delivery_address.choose_address')} />
      <View style={styles.container}>
        <MapView
          ref={_mapView}
          provider={PROVIDER_GOOGLE}
          style={styles.mapView}
          initialRegion={region}
          onRegionChangeComplete={_onRegionChanged}
          onPanDrag={_onPanDrag}
          onUserLocationChange={_onUserLocationChange}
          showsUserLocation
          cacheEnabled={readOnlyMode}
          zoomControlEnabled={!readOnlyMode}
          zoomEnabled={!readOnlyMode}
          scrollEnabled={!readOnlyMode}
          rotateEnabled={!readOnlyMode}
          pitchEnabled={!readOnlyMode}
          {...mapViewProps}
        />

        <Touchable style={styles.myLocationButton} onPress={onPressMyLocation}>
          <Image source={images.client.gps} tintColor={colors.color5B5A5A} />
        </Touchable>

        <Animated.View style={[styles.shadow, shadowStyle]}>
          <View style={styles.innerShadow} />
        </Animated.View>
        <Animated.Image
          style={[styles.marker, markerStyle]}
          source={images.client.storeMarker}
          resizeMode="contain"
        />

        <View style={styles.autoCompleteContainer}>
          <AutocompleteDropdown
            controller={controller => {
              _dropdownRef.current = controller;
            }}
            // initialValue={'1'}
            direction={Platform.select({ ios: 'down' })}
            dataSet={suggestions}
            onChangeText={fetchSuggestions}
            onSelectItem={_onPressSuggestion}
            debounce={600}
            suggestionsListMaxHeight={dimensions.height * 0.4}
            onClear={onClearPress}
            useFilter={false} // set false to prevent rerender twice
            textInputProps={{
              placeholder: 'Nhập để tìm kiếm địa chỉ ...',
              autoCorrect: false,
              autoCapitalize: 'none',
              style: { padding: 0, color: colors.black },
              onPressIn: () => setIsFocus(true),
            }}
            inputContainerStyle={styles.searchInput}
            renderItem={_renderItem}
            LeftIconComponent={
              <Image
                source={images.common.search}
                tintColor={colors.colorDADADA}
                style={styles.autoCompleteIcon}
              />
            }
            ClearIconComponent={<Image source={images.common.closeRounded} />}
            EmptyResultComponent={<View />}
            inputHeight={Number(40).adjusted()}
            showChevron={false}
            closeOnBlur={true}
            clearOnFocus={false}
          />
        </View>

        {!readOnlyMode && (Platform.OS === 'ios' || !isFocus) && (
          <AnimatedButton
            text={confirmText || t('common.confirm')}
            colors={[colors.primary]}
            style={styles.button}
            onPress={_submit}
            disabled={!address?.address}
            entering={FadeInDown}
            exiting={FadeOutDown}
          />
        )}
      </View>
    </>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapView: {
    flex: 1,
  },
  myLocationButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 66,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 4,
  },
  autoCompleteContainer: {
    position: 'absolute',
    flex: 1,
    left: 12,
    right: 12,
    top: 12,
    borderRadius: 12,
    zIndex: 2,
  },
  autoCompleteIcon: {
    resizeMode: 'contain',
  },
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 24,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
  },
  suggestionItemText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.color161616,
    marginLeft: 12,
  },
  button: {
    position: 'absolute',
    bottom: isIphoneX() ? getBottomSpace() : 16,
    left: 16,
    right: 16,
    borderRadius: 24,
  },
  marker: {
    height: MARKER_SIZE,
    width: MARKER_SIZE,
    position: 'absolute',
    top: (dimensions.height - MARKER_SIZE) / 2 - BOTTOM_SPACING - BUTTON_SIZE,
    alignSelf: 'center',
    zIndex: 1,
  },
  shadow: {
    position: 'absolute',
    top:
      (dimensions.height + MARKER_SIZE) / 2 - BOTTOM_SPACING - BUTTON_SIZE - 8,
    alignSelf: 'center',
    width: 18,
    height: 18,
    backgroundColor: colors.colorB8B8B857,
    borderRadius: 12,
    transform: [{ scaleX: 2 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerShadow: {
    width: 12,
    height: 12,
    backgroundColor: colors.color69696980,
    borderRadius: 6,
  },
});
