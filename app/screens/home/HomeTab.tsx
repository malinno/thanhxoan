import ApiErp from '@app/api/ApiErp';
import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { TabParamsList } from '@app/navigators/RootNavigator';
import { useErpUserDetail } from '@app/queries/user.query';
import MyAvatar from '@core/components/MyAvatar';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { FunctionComponent, useCallback, useEffect } from 'react';
import {
  Image,
  InteractionManager,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeCurrentCheckIn from './components/HomeCurrentCheckIn';
import HomeQuickAccess from './components/HomeQuickAccess';
import HomeRevenue from './components/HomeRevenue';
import HomeWeekAttendance from './components/HomeWeekAttendance';

type Props = BottomTabScreenProps<TabParamsList, SCREEN.HOME_TAB>;

const HomeTab: FunctionComponent<Props> = props => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const user = useAuth(state => state.user);
  const signOut = useAuth(state => state.signOut);
  const {
    data,
    refetch: refetchUserDetail,
    error,
  } = useErpUserDetail(user?.id, false);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.id) refetchUserDetail();
      });

      return () => task.cancel();
    }, [user]),
  );

  useEffect(() => {
    if (error) {
      ApiErp.parseErrorMessage({ error });
    }
  }, [error]);

  const _onPressProfile = () => navigation.navigate(SCREEN.PROFILE, {});

  const _onPressNotifications = () => {
    navigation.navigate(SCREEN.NOTIFICATIONS_LIST, {});
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <Image
        style={[StyleSheet.absoluteFill, styles.background]}
        source={images.home.background}
      />
      <HStack style={[styles.header, { marginTop: insets.top + 16 }]}>
        <Touchable style={styles.user} onPress={_onPressProfile}>
          <MyAvatar size={46} style={styles.avatar} name={user?.name} />
          <Text style={styles.name} numberOfLines={1}>
            {user?.name || ''}
          </Text>
        </Touchable>

        <Touchable onPress={_onPressNotifications}>
          <Image source={images.common.bell} />
        </Touchable>
      </HStack>

      <HomeRevenue style={styles.revenue} />

      <HomeQuickAccess />

      <HomeCurrentCheckIn />

      <HomeWeekAttendance />
    </ScrollView>
  );
};

export default HomeTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  background: {
    width: '100%',
  },
  header: {
    paddingHorizontal: 16,
  },
  user: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  avatar: {
    marginRight: 12,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  revenue: {
    marginHorizontal: 16,
  },
});
