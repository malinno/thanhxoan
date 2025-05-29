import {
  RouteProp,
  useNavigation,
  useRoute,
  useIsFocused,
  NavigationProp,
} from '@react-navigation/native';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AwesomeGallery, {
  GalleryRef,
  RenderItemInfo,
} from 'react-native-awesome-gallery';
import * as React from 'react';
import Animated, {
  FadeInDown,
  FadeInUp,
  FadeOutDown,
  FadeOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { SCREEN } from '@app/enums/screen.enum';
import { colors } from '@core/constants/colors.constant';

const renderItem = ({
  item,
  setImageDimensions,
}: RenderItemInfo<{ uri: string }>) => {
  return (
    <Image
      source={{ uri: Boolean(item.uri) ? item.uri : undefined }}
      style={StyleSheet.absoluteFillObject}
      resizeMode="contain"
      onLoad={e => {
        const { width, height } = e.nativeEvent.source;
        setImageDimensions({ width, height });
      }}
    />
  );
};

const PhotoViewerScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { setParams, goBack } =
    useNavigation<NavigationProp<RootStackParamsList, SCREEN.PHOTO_VIEWER>>();
  const isFocused = useIsFocused();
  const { params } =
    useRoute<RouteProp<RootStackParamsList, SCREEN.PHOTO_VIEWER>>();
  const gallery = useRef<GalleryRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [infoVisible, setInfoVisible] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle(isFocused ? 'light-content' : 'dark-content', true);
    if (!isFocused) {
      StatusBar.setHidden(false, 'fade');
    }
  }, [isFocused]);

  const onIndexChange = useCallback(
    (index: number) => {
      isFocused && setParams({ index });
    },
    [isFocused, setParams],
  );

  const onTap = () => {
    // StatusBar.setHidden(infoVisible, 'slide');
    setInfoVisible(!infoVisible);
  };

  return (
    <View style={styles.container}>
      <AwesomeGallery
        ref={gallery}
        data={params.images.map(uri => ({ uri }))}
        keyExtractor={(item, index) => item.uri + '_' + String(index)}
        renderItem={renderItem}
        initialIndex={params.index}
        numToRender={3}
        doubleTapInterval={150}
        onIndexChange={onIndexChange}
        onSwipeToClose={goBack}
        onTap={onTap}
        loop
        onScaleEnd={scale => {
          if (scale < 0.8) {
            goBack();
          }
        }}
        style={{ backgroundColor: colors.color22222280 }}
      />
      <View style={[styles.indicatorContainer]}>
        <Text style={styles.indicatorText}>
          {params.index + 1}/{params.images.length}
        </Text>
      </View>
    </View>
  );
};

export default PhotoViewerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: colors.color222222B2,
  },
  indicatorText: {
    fontSize: 12,
    color: colors.white,
  },
});
