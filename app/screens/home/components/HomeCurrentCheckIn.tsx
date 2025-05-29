import HStack from '@app/components/HStack';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { CheckInState } from '@app/enums/check-in-state.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useCheckInOutList } from '@app/queries/check-in-out.query';
import CheckInTimer from '@app/screens/check-in-out/components/CheckInTimer';
import { AnimatedTouchable } from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import React, { useCallback } from 'react';
import { Image, InteractionManager, StyleSheet, Text } from 'react-native';
import { SlideInLeft } from 'react-native-reanimated';

const HomeCurrentCheckIn = () => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const { data: currentCheckInRecords, refetch: refetchUserCurrentCheckIn } =
    useCheckInOutList(
      {
        state: CheckInState.inprogress,
        category: CheckInOutCategory.working_route,
        salesperson_id: user?.id,
      },
      false,
    );

  const currentCheckIn = currentCheckInRecords?.[0];

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.id) refetchUserCurrentCheckIn();
      });

      return () => task.cancel();
    }, [user]),
  );

  const _onPress = () => {
    if (!currentCheckIn) return;

    navigation.navigate(SCREEN.CHECK_IN_OUT, {
      checkInOutId: currentCheckIn.id,
    });
  };

  if (!currentCheckIn) return null;

  return (
    <AnimatedTouchable
      entering={SlideInLeft.springify(500)}
      style={styles.container}
      onPress={_onPress}>
      <CheckInTimer
        icon={images.home.fire}
        text="Đang check in tại"
        textStyle={{
          fontSize: 12,
          fontWeight: '700',
          color: colors.colorFF7F00,
        }}
        from={
          currentCheckIn?.check_in
            ? dayjs(currentCheckIn?.check_in).valueOf()
            : undefined
        }
        to={
          currentCheckIn?.check_out
            ? dayjs(currentCheckIn?.check_out).valueOf()
            : undefined
        }
      />
      <HStack style={{ gap: 8 }}>
        <Image
          source={images.client.store}
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.text}>{currentCheckIn?.store_id?.name}</Text>
      </HStack>
    </AnimatedTouchable>
  );
};

export default HomeCurrentCheckIn;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.colorFFDFCF4D,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  icon: {
    width: 24,
    height: 13,
  },
  text: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.color0047B1,
  },
});
