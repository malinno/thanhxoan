import HStack from '@app/components/HStack';
import MyAvatar from '@core/components/MyAvatar';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import { useNavigation } from '@react-navigation/native';
import React, { FC, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import ProfileFeatureItem, {
  ProfileFeatureItemProps,
} from './components/ProfileFeatureItem';
import images from '@images';
import { useAuth } from '@app/hooks/useAuth';
import { SCREEN } from '@app/enums/screen.enum';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import CardText from './components/CardText';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useErpUserDetail } from '@app/queries/user.query';

const FEATURES: ProfileFeatureItemProps[] = [
  // {
  //   id: 'routes_list',
  //   leftIcon: images.profile.map,
  //   name: 'Lịch trình tuyến',
  //   rightIcon: images.common.arrowRight,
  // },
  {
    id: 'check_in_out',
    leftIcon: images.profile.pointers,
    name: 'Lịch sử Check in - Check out',
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'check_in_out_explanation',
    leftIcon: images.othersTab.turbine,
    name: 'Giải trình check in - out',
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'attendance_list',
    leftIcon: images.profile.dateRange,
    name: 'Bảng tổng hợp chấm công',
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'timekeeping_explanation',
    leftIcon: images.profile.timeProgress,
    name: 'Danh sách phiếu giải trình công',
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'change_password',
    leftIcon: images.profile.password,
    name: 'Đổi mật khẩu',
    rightIcon: images.common.arrowRight,
  },
];

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.PROFILE>;

const ProfileScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const { data } = useErpUserDetail(user?.id);

  const onPressFeatureItem = useCallback((id: string) => {
    switch (id) {
      case 'routes_list': {
        if (!user?.id) return;
        navigation.navigate(SCREEN.ROUTE_PLAN_SCHEDULES_LIST, {
          filter: { salesperson_id: user?.id },
        });
        break;
      }
      case 'check_in_out':
        navigation.navigate(SCREEN.CHECK_IN_OUT_HISTORIES, {
          filter: {
            category: CheckInOutCategory.working_route,
            salesperson_id: user?.id,
          },
        });
        break;
      case 'check_in_out_explanation':
        navigation.navigate(SCREEN.CHECK_IN_OUT_EXPLANATIONS_LIST, {
          filter: {
            salesperson_id: user?.id,
          }
        });
        break;
      case 'attendance_list':
        navigation.navigate(SCREEN.ATTENDANCE_LIST, {
          filter: { employee_id: user?.id },
        });
        break;
      case 'timekeeping_explanation':
        navigation.navigate(SCREEN.TIMEKEEPING_EXPLANATION_LIST, {
          filter: { employee_id: user?.id },
        });
        break;
      case 'change_password':
        navigation.navigate(SCREEN.RESET_PASSWORD, {});
        break;
      default:
        break;
    }
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Thông tin cá nhân" />
      <View style={styles.container}>
        <HStack style={styles.card}>
          <MyAvatar
            size={60}
            name={user?.name}
            src={!!data?.image_url ? { uri: data?.image_url } : undefined}
            style={styles.avatar}
          />
          <View style={styles.cardContent}>
            <Text style={[styles.name]}>{user?.name}</Text>
            <CardText label="Chức vụ:" text={data?.dms_access || ''} />
            <CardText label="Công ty:" text={data?.crm_group_id?.name || ''} />
            <CardText label="Email:" text={data?.login} />
          </View>
        </HStack>

        {FEATURES.map((feature, index) => {
          return (
            <ProfileFeatureItem
              key={String(index)}
              {...feature}
              onPress={onPressFeatureItem}
            />
          );
        })}
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.color1F37A8,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.white,
  },
  cardText: {
    fontSize: 12,
    color: colors.white,
    marginTop: 8,
  },
});
