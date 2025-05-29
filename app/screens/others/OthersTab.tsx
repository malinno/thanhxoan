import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useDevMode } from '@app/hooks/useDevMode';
import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import { TabParamsList } from '@app/navigators/RootNavigator';
import { editEmployeeMapMutation } from '@app/queries/employee-map.mutation';
import { useEmployeeMapRecords } from '@app/queries/user.query';
import UserRepo from '@app/repository/user/UserRepo';
import Header from '@core/components/Header';
import Popup, { POPUP_TYPE } from '@core/components/popup/Popup';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import Text from '@core/components/Text';
import Touchable from '@core/components/Touchable';
import { colors } from '@core/constants/colors.constant';
import { TIMEOUT_DURATION } from '@core/constants/core.constant';
import images from '@images';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import QueryString from 'qs';
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  InteractionManager,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import EnterDevMode from './components/EnterDevMode';
import OtherFeatureItem, {
  OtherFeatureItemProps,
} from './components/OtherFeatureItem';
import { DEV_MODE_PRESS_COUNT } from '@app/constants/app.constant';

type Props = BottomTabScreenProps<TabParamsList, SCREEN.OTHERS_TAB>;

const FEATURES: OtherFeatureItemProps[] = [
  {
    id: 'routers',
    name: 'Tuyến bán hàng',
    leftIcon: images.othersTab.wayToPinLocation,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'route_check_in_out',
    name: 'Lịch sử Check in - Check out',
    leftIcon: images.othersTab.reverseClock,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'calendar_check_in_out',
    name: 'Danh sách chấm công',
    leftIcon: images.common.calendarFilled,
    rightIcon: images.common.arrowRight,
    leftIconStyle: { tintColor: colors.primary },
  },
  {
    id: 'inventory',
    name: 'Danh sách kiểm kê',
    leftIcon: images.othersTab.cubeWithLoupe,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'staffs_map',
    name: 'Bản đồ nhân viên',
    leftIcon: images.othersTab.pinUser,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'user-scopes',
    name: 'Phạm vi phụ trách',
    leftIcon: images.othersTab.roadFinish,
    rightIcon: images.common.arrowRight,
  },
  // {
  //   id: 'promotions',
  //   name: 'Chương trình khuyến mãi',
  //   leftIcon: images.othersTab.promotion,
  //   rightIcon: images.common.arrowRight,
  // },
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
    id: 'checkin_out_explanation',
    name: 'Giải trình check in-out',
    leftIcon: images.othersTab.turbine,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'report',
    name: 'Báo cáo',
    leftIcon: images.othersTab.pieChartFill,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'showcase',
    name: 'Đăng ký trưng bày',
    leftIcon: images.client.pointers,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'slide',
    name: 'Học online',
    leftIcon: images.client.buffer,
    rightIcon: images.common.arrowRight,
  },
  {
    id: 'sign_out',
    leftIcon: images.othersTab.signOut,
    name: 'Đăng xuất',
  },
];

const OthersTab: FunctionComponent<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const signOut = useAuth(state => state.signOut);
  const isDevModeEnabled = useDevMode(state => state.isDevMode);
  const setDevMode = useDevMode(state => state.setDevMode);

  const [pressedCount, setPressedCount] = useState<number>(0);

  const mutation = editEmployeeMapMutation();

  const {
    data: employeeMapRecords,
    refetch: refetchEmployeeMapRecords,
    isRefetching: isRefetchingEmployeeMapRecords,
  } = useEmployeeMapRecords({ user_id: user?.id }, false);

  // effects
  useEffect(() => {
    if (mutation.isPending || isRefetchingEmployeeMapRecords) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending, isRefetchingEmployeeMapRecords]);

  useEffect(() => {
    if (user?.id && employeeMapRecords) {
      const record = employeeMapRecords.find(d => d.user_id?.id === user?.id);
      if (record) {
        const now = dayjs();

        mutation
          .mutateAsync({
            id: record.id,
            data: {
              update_uid: user.id,
              user_id: user.id,
              state: 'offline',
              map_time: now.format('YYYY-MM-DD HH:mm:ss'),
            },
          })
          .then(({ response }) => {
            console.log(`update employee map response`, response);
          })
          .catch(err => {
            console.log(`update employee map err`, err);
          })
          .finally(() => {
            signOut();
          });
      } else signOut();
    }
  }, [employeeMapRecords, user]);

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        setPressedCount(0);
      });

      return () => task.cancel();
    }, []),
  );

  useEffect(() => {
    if (pressedCount === DEV_MODE_PRESS_COUNT) {
      toggleDevMode();
      setPressedCount(0);
    }
  }, [pressedCount]);

  const onPressSignOut = async () => {
    if (!user?.id) return;
    try {
      await offline();
    } catch (error) {
      console.log(`error `, error);
    } finally {
      signOut();
    }
  };

  const getRecord = async () => {
    if (!user?.id) return;
    const { response, error } = await UserRepo.getEmployeeMapsList({
      user_id: user.id,
    });
    if (error || !response.employee_maps) return;
    const data: EmployeeMap[] = response.employee_maps;
    return data.find(d => d.user_id?.id === user.id);
  };

  const offline = async () => {
    if (!user?.id) return;
    Spinner.show();
    const record = await Promise.race([getRecord(), sleep(TIMEOUT_DURATION)]);
    Spinner.hide();
    if (!record) return;

    const now = dayjs();

    return new Promise((resolve, reject) => {
      mutation
        .mutateAsync({
          id: record.id,
          data: {
            update_uid: user.id,
            user_id: user.id,
            state: 'offline',
            map_time: now.format('YYYY-MM-DD HH:mm:ss'),
          },
        })
        .then(({ response }) => {
          console.log(`update employee map response`, response);
          resolve(response);
        })
        .catch(err => {
          console.log(`update employee map err`, err);
          reject(err);
        });
    });
  };

  const onPressFeatureItem = useCallback((id: string) => {
    switch (id) {
      case 'route_check_in_out':
        navigation.navigate(SCREEN.CHECK_IN_OUT_HISTORIES, {
          filter: {
            category: CheckInOutCategory.working_route,
            // salesperson_id: user?.id
          },
        });
        break;
      case 'calendar_check_in_out':
        navigation.navigate(SCREEN.CHECK_IN_OUT_HISTORIES, {
          filter: { category: CheckInOutCategory.working_calendar },
          screenTitle: 'Danh sách chấm công',
        });
        break;
      case 'staffs_map':
        navigation.navigate(SCREEN.STAFFS_MAP, {});
        break;
      case 'routers': {
        if (!user?.id) break;
        navigation.navigate(SCREEN.ROUTER_LIST, {});
        break;
      }
      case 'inventory':
        navigation.navigate(SCREEN.STOCK_INVENTORY_LIST, {});
        break;
      case 'user-scopes': {
        const params = QueryString.stringify({
          action: 1805,
          cids: 1,
          menu_id: 1030,
          model: 'user.scope.of.responsibility',
          view_type: 'list',
        });

        const url = new URL('web', Config.WEB_BASE_URL);
        url.hash = params;

        navigation.navigate(SCREEN.WEBVIEW, { url: String(url) });

        break;
      }
      case 'promotions': {
        navigation.navigate(SCREEN.PROMOTIONS_LIST);
        break;
      }
      case 'attendance_list':
        navigation.navigate(SCREEN.ATTENDANCE_LIST);
        break;
      case 'timekeeping_explanation':
        navigation.navigate(SCREEN.TIMEKEEPING_EXPLANATION_LIST);
        break;
      case 'checkin_out_explanation': {
        navigation.navigate(SCREEN.CHECK_IN_OUT_EXPLANATIONS_LIST);
        break;
      }
      case 'report': {
        const params = QueryString.stringify({
          action: 694,
          cids: 1,
          menu_id: 498,
          model: 'chautq.report',
          view_type: 'form',
        });

        const url = new URL('web', Config.WEB_BASE_URL);
        url.hash = params;

        navigation.navigate(SCREEN.WEBVIEW, {
          url: String(url),
          cacheEnabled: false,
        });
        break;
      }
      case 'showcase': {
        const params = QueryString.stringify({
          action: Config.ODOO_SHOWCASE_ACTION_ID,
          cids: 1,
          menu_id: 1030,
          model: 'dms.agree.showcase',
          view_type: 'kanban',
        });

        const url = new URL('web', Config.WEB_BASE_URL);
        url.hash = params;

        navigation.navigate(SCREEN.WEBVIEW, {
          url: String(url),
        });
        break;
      }
      case 'slide': {
        const params = QueryString.stringify({
          action: Config.ODOO_ELEARNING_ACTION_ID,
          cids: 1,
          menu_id: 763,
          model: 'slide.channel',
          view_type: 'kanban',
        });

        const url = new URL('web', Config.ODOO_ELEARNING_URL);
        url.hash = params;

        navigation.navigate(SCREEN.WEBVIEW, {
          url: String(url),
        });
        break;
      }
      case 'sign_out':
        onPressSignOut();
        break;
      default:
        break;
    }
  }, []);

  const onPressVersion = () => {
    if (pressedCount < DEV_MODE_PRESS_COUNT) setPressedCount(pressedCount + 1);
  };

  const toggleDevMode = () => {
    if (!isDevModeEnabled) {
      return Popup.show({
        type: POPUP_TYPE.BOTTOM_SHEET,
        props: {
          title: 'Bật dev mode',
          renderContent: () => {
            return <EnterDevMode />;
          },
        },
      });
    }
    setDevMode(false);
  };

  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  return (
    <View style={styles.container}>
      <Header
        title="Mở rộng"
        leftButtons={[
          {
            icon: images.common.group,
          },
        ]}
      />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {FEATURES.map((feature, index) => {
          return (
            <OtherFeatureItem
              key={feature.id}
              {...feature}
              style={[styles.featureItem, index === 0 && { marginTop: 20 }]}
              onPress={onPressFeatureItem}
            />
          );
        })}

        <TouchableOpacity
          activeOpacity={1}
          style={styles.versionContainer}
          onPress={onPressVersion}>
          <Text style={styles.version}>
            Phiên bản {version} {`Build: ${buildNumber}`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default OthersTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  featureItem: {
    marginTop: 6,
  },
  versionContainer: {
    paddingTop: 20,
    paddingBottom: 12,
  },
  version: {
    textAlign: 'center',
    fontWeight: '500',
    color: colors.color22222280,
  },
});
