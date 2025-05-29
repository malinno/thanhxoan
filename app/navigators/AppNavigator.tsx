import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useDeviceGeolocation } from '@app/hooks/useDeviceGeolocation';
import { EmployeeMapDto } from '@app/interfaces/dtos/employee-map.dto';
import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import UserRepo from '@app/repository/user/UserRepo';
import MapScreen from '@app/screens/address/MapScreen';
import FlashCalendarScreen from '@app/screens/calendar/FlashCalendarScreen';
import CameraScreen from '@app/screens/camera/CameraScreen';
import CodeScannerScreen from '@app/screens/camera/CodeScannerScreen';
import CheckInOutExplanationDetailScreen from '@app/screens/check-in-out/CheckInOutExplanationDetailScreen';
import CheckInOutExplanationsListScreen from '@app/screens/check-in-out/CheckInOutExplanationsListScreen';
import CheckInOutHistoriesScreen from '@app/screens/check-in-out/CheckInOutHistoriesScreen';
import CheckInOutScreen from '@app/screens/check-in-out/CheckInOutScreen';
import AgenciesListScreen from '@app/screens/clients/AgenciesListScreen';
import ClientDetailScreen from '@app/screens/clients/ClientDetailScreen';
import ContactDetailScreen from '@app/screens/clients/ContactDetailScreen';
import ContactsListScreen from '@app/screens/clients/ContactsListScreen';
import CreateClientScreen from '@app/screens/clients/CreateClientScreen';
import CreateContactScreen from '@app/screens/clients/CreateContactScreen';
import CustomersPickerScreen from '@app/screens/clients/CustomersPickerScreen';
import EditClientScreen from '@app/screens/clients/EditClientScreen';
import PurchasedProductsListScreen from '@app/screens/clients/PurchasedProductsListScreen';
import MultiSelectScreen from '@app/screens/common/MultiSelectScreen';
import CreateShowcaseDeclarationScreen from '@app/screens/exhibition/CreateShowcaseDeclarationScreen';
import ShowcaseDeclarationDetailScreen from '@app/screens/exhibition/ShowcaseDeclarationDetailScreen';
import ShowcaseDeclarationsListScreen from '@app/screens/exhibition/ShowcaseDeclarationsListScreen';
import ShowcaseImagesListScreen from '@app/screens/exhibition/ShowcaseImagesListScreen';
import StockInventoryDetailScreen from '@app/screens/inventory/StockInventoryDetailScreen';
import StockInventoryFilterScreen from '@app/screens/inventory/StockInventoryFilterScreen';
import StockInventoryFormScreen from '@app/screens/inventory/StockInventoryFormScreen';
import StockInventoryListScreen from '@app/screens/inventory/StockInventoryListScreen';
import StockInventoryProductDetailScreen from '@app/screens/inventory/StockInventoryProductDetailScreen';
import StockInventoryProductsScreen from '@app/screens/inventory/StockInventoryProductsScreen';
import StocktakingScreen from '@app/screens/inventory/StocktakingScreen';
import CreateLeadNoteScreen from '@app/screens/leads/CreateLeadNoteScreen';
import EditLeadScreen from '@app/screens/leads/EditLeadScreen';
import LeadDetailScreen from '@app/screens/leads/LeadDetailScreen';
import LeadsListScreen from '@app/screens/leads/LeadsListScreen';
import DetectLocationScreen from '@app/screens/location/DetectLocationScreen';
import LoggerScreen from '@app/screens/network/LoggerScreen';
import NotificationsListScreen from '@app/screens/notification/NotificationsListScreen';
import CreatePosOrderScreen from '@app/screens/orders/CreatePosOrderScreen';
import CreateSaleOrderScreen from '@app/screens/orders/CreateSaleOrderScreen';
import EditPosOrderScreen from '@app/screens/orders/EditPosOrderScreen';
import PosOrderDetailScreen from '@app/screens/orders/PosOrderDetailScreen';
import PosOrdersListScreen from '@app/screens/orders/PosOrdersListScreen';
import SaleOrderDetailScreen from '@app/screens/orders/SaleOrderDetailScreen';
import SaleOrdersListScreen from '@app/screens/orders/SaleOrdersListScreen';
import PhotoViewerScreen from '@app/screens/photo-viewer/PhotoViewerScreen';
import ProductsPickerScreen from '@app/screens/products/ProductsPickerScreen';
import ProfileScreen from '@app/screens/profile/ProfileScreen';
import ResetPasswordScreen from '@app/screens/profile/ResetPasswordScreen';
import PromotionDetailScreen from '@app/screens/promotion/PromotionDetailScreen';
import PromotionsFilterScreen from '@app/screens/promotion/PromotionsFilterScreen';
import PromotionsListScreen from '@app/screens/promotion/PromotionsListScreen';
import PromotionsPickerScreen from '@app/screens/promotion/PromotionsPickerScreen';
import CreateRoutePlanScreen from '@app/screens/route-plans/CreateRoutePlanScreen';
import CreateRouteScheduleScreen from '@app/screens/route-plans/CreateRouteScheduleScreen';
import RoutePlanDetailScreen from '@app/screens/route-plans/RoutePlanDetailScreen';
import RoutePlanSchedulesListScreen from '@app/screens/route-plans/RoutePlanSchedulesListScreen';
import RoutePlansFilterScreen from '@app/screens/route-plans/RoutePlansFilterScreen';
// import RoutePlansListScreen from '@app/screens/route-plans/RoutePlansListScreen';
import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import BankAccountsListScreen from '@app/screens/bank/BankAccountsListScreen';
import CreateBankAccountScreen from '@app/screens/bank/CreateBankAccountScreen';
import EditBankAccountScreen from '@app/screens/bank/EditBankAccountScreen';
import AttendanceDetailScreen from '@app/screens/check-in-out/AttendanceDetailScreen';
import AttendanceListScreen from '@app/screens/check-in-out/AttendanceListScreen';
import AttendancesFilterScreen from '@app/screens/check-in-out/AttendancesFilterScreen';
import CheckInOutFilterScreen from '@app/screens/check-in-out/CheckInOutFilterScreen';
import CreateCheckInOutExplanationScreen from '@app/screens/check-in-out/CreateCheckInOutExplanationScreen';
import CreateTimekeepingExplanationScreen from '@app/screens/check-in-out/CreateTimekeepingExplanationScreen';
import TimekeepingExplanationDetailScreen from '@app/screens/check-in-out/TimekeepingExplanationDetailScreen';
import TimekeepingExplanationListScreen from '@app/screens/check-in-out/TimekeepingExplanationListScreen';
import ClientsFilterScreen from '@app/screens/clients/ClientsFilterScreen';
import CreateReturnProductScreen from '@app/screens/clients/CreateReturnProductScreen';
import ReturnProductDetailScreen from '@app/screens/clients/ReturnProductDetailScreen';
import ReturnProductListScreen from '@app/screens/clients/ReturnProductListScreen';
import UsersPickerScreen from '@app/screens/common/UsersPickerScreen';
import AvailableInventoryReportScreen from '@app/screens/inventory/AvailableInventoryReportScreen';
import EditSaleOrderScreen from '@app/screens/orders/EditSaleOrderScreen';
import PosOrdersFilterScreen from '@app/screens/orders/PosOrdersFilterScreen';
import PromotionGiftPickerScreen from '@app/screens/promotion/PromotionGiftPickerScreen';
import RoutePlansListScreen from '@app/screens/route-plans/RoutePlansListScreen2';
import RouteSchedulesFilterScreen from '@app/screens/route-plans/RouteSchedulesFilterScreen';
import RouteStoresPickerScreen from '@app/screens/route-plans/RouteStoresPickerScreen';
import CreateRouterFormScreen from '@app/screens/router/CreateRouterScreen';
import EditRouterScreen from '@app/screens/router/EditRouterScreen';
import RouterDetailScreen from '@app/screens/router/RouterDetailScreen';
import RouterListScreen from '@app/screens/router/RouterListScreen';
import RouterTrackingScreen from '@app/screens/router/RouterTrackingScreen';
import StaffsMapScreen from '@app/screens/staff/StaffsMapScreen';
import TagsScreen from '@app/screens/tag/TagsScreen';
import WebViewScreen from '@app/screens/webview/WebViewScreen';
import Alert from '@core/components/popup/Alert';
import { useAppState } from '@react-native-community/hooks';
import { useNetInfo } from '@react-native-community/netinfo';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import dayjs from 'dayjs';
import React, { useEffect, useRef } from 'react';
import { AppStateStatus, Platform } from 'react-native';
import BottomTabStack from './BottomTabStack';
import { RootStackParamsList } from './RootNavigator';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const AppNavigator = () => {
  const netInfo = useNetInfo();
  const appState = useAppState();
  const user = useAuth(state => state.user);

  const beforeAppState = useRef<AppStateStatus>();

  const startTracking = useDeviceGeolocation(state => state.startTracking);
  const stopTracking = useDeviceGeolocation(state => state.stopTracking);
  const deviceLocation = useDeviceGeolocation(state => state.geolocation);

  useEffect(() => {
    if (!user?.id) return;
    const watchId = startTracking();
    return () => stopTracking(watchId);
  }, [user]);

  useEffect(() => {
    if (!deviceLocation || !user?.id || beforeAppState.current === appState)
      return;

    const now = dayjs();

    const update = (id: number | string, data?: Partial<EmployeeMapDto>) => {
      UserRepo.editEmployeeMap(id, {
        ...data,
        update_uid: user.id,
        latitude: String(deviceLocation.coords.latitude),
        longitude: String(deviceLocation.coords.longitude),
        map_time: now.format('YYYY-MM-DD HH:mm:ss'),
      });
    };

    const create = () => {
      UserRepo.createEmployeeMap({
        create_uid: user.id,
        user_id: user.id,
        latitude: String(deviceLocation.coords.latitude),
        longitude: String(deviceLocation.coords.longitude),
        map_time: now.format('YYYY-MM-DD HH:mm:ss'),
        state: 'online',
      });
    };

    const getRecord = async () => {
      const { response, error } = await UserRepo.getEmployeeMapsList({
        user_id: user.id,
      });
      if (error || !response.employee_maps) return;
      const data: EmployeeMap[] = response.employee_maps;
      return data.find(d => d.user_id?.id === user.id);
    };

    const sendLocation = async () => {
      const record = await getRecord();
      if (record) update(record.id, { state: 'online' });
      else create();
    };

    const offline = async () => {
      const record = await getRecord();
      if (!record) return;
      update(record.id, { state: 'offline' });
    };

    let intervalId: NodeJS.Timeout | undefined;

    switch (appState) {
      case 'active':
        sendLocation();
        intervalId = setInterval(sendLocation, 30 * 1000);
        break;
      case 'background':
        if (Platform.OS === 'android') offline();
        if (intervalId) clearInterval(intervalId);
        break;
      case 'inactive':
        if (Platform.OS === 'ios') offline();
        if (intervalId) clearInterval(intervalId);
        break;
      default:
        break;
    }
    beforeAppState.current = appState;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [deviceLocation, user, appState]);

  useEffect(() => {
    if (
      netInfo?.isConnected === false ||
      netInfo?.isInternetReachable === false
    )
      Alert.alert({
        title: 'Thông báo',
        message: `Bạn đang ngoại tuyến\nVui lòng kiểm tra kết nối Internet của bạn`,
      });
  }, [netInfo.isConnected]);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={SCREEN.BOTTOM_TAB}>
      <Stack.Group>
        <Stack.Screen name={SCREEN.BOTTOM_TAB} component={BottomTabStack} />
        <Stack.Screen name={SCREEN.PROFILE} component={ProfileScreen} />
        <Stack.Screen
          name={SCREEN.NOTIFICATIONS_LIST}
          component={NotificationsListScreen}
        />
        <Stack.Screen name={SCREEN.STAFFS_MAP} component={StaffsMapScreen} />
        <Stack.Screen
          name={SCREEN.CLIENTS_FILTER}
          component={ClientsFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.CLIENT_DETAIL}
          component={ClientDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_CLIENT}
          component={CreateClientScreen}
        />
        <Stack.Screen name={SCREEN.EDIT_CLIENT} component={EditClientScreen} />
        <Stack.Screen
          name={SCREEN.CONTACTS_LIST}
          component={ContactsListScreen}
        />
        <Stack.Screen
          name={SCREEN.CONTACT_DETAIL}
          component={ContactDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_CONTACT}
          component={CreateContactScreen}
        />
        <Stack.Screen
          name={SCREEN.AGENCIES_LIST}
          component={AgenciesListScreen}
        />
        <Stack.Screen
          name={SCREEN.PURCHASED_PRODUCTS_LIST}
          component={PurchasedProductsListScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_PLANS_LIST}
          component={RoutePlansListScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_PLANS_FILTER}
          component={RoutePlansFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_PLAN_DETAIL}
          component={RoutePlanDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_PLAN_SCHEDULES_LIST}
          component={RoutePlanSchedulesListScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_SCHEDULES_FILTER}
          component={RouteSchedulesFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_ROUTE_SCHEDULE}
          component={CreateRouteScheduleScreen}
        />
        <Stack.Screen
          name={SCREEN.CHECK_IN_OUT}
          component={CheckInOutScreen}
          initialParams={{
            category: CheckInOutCategory.working_route,
            screenTitle: 'Check in - Check out',
          }}
        />
        <Stack.Screen
          name={SCREEN.CHECK_IN_OUT_HISTORIES}
          component={CheckInOutHistoriesScreen}
          initialParams={{
            filter: { category: CheckInOutCategory.working_route },
            screenTitle: 'Lịch sử Check in - Check out',
          }}
        />
        <Stack.Screen
          name={SCREEN.CHECK_IN_OUT_FILTER}
          component={CheckInOutFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_ROUTE_PLAN}
          component={CreateRoutePlanScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTE_STORES_PICKER}
          component={RouteStoresPickerScreen}
        />
        <Stack.Screen name={SCREEN.ROUTER_LIST} component={RouterListScreen} />
        <Stack.Screen
          name={SCREEN.ROUTER_DETAIL}
          component={RouterDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_ROUTER}
          component={CreateRouterFormScreen}
        />
        <Stack.Screen name={SCREEN.EDIT_ROUTER} component={EditRouterScreen} />
        <Stack.Screen
          name={SCREEN.SHOWCASE_DECLARATIONS}
          component={ShowcaseDeclarationsListScreen}
        />
        <Stack.Screen
          name={SCREEN.SHOWCASE_DECLARATION_DETAIL}
          component={ShowcaseDeclarationDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_SHOWCASE_DECLARATION}
          component={CreateShowcaseDeclarationScreen}
        />
        <Stack.Screen
          name={SCREEN.SHOWCASE_DECLARATION_IMAGES}
          component={ShowcaseImagesListScreen}
        />
        <Stack.Screen name={SCREEN.LEADS_LIST} component={LeadsListScreen} />
        <Stack.Screen name={SCREEN.LEAD_DETAIL} component={LeadDetailScreen} />
        <Stack.Screen name={SCREEN.EDIT_LEAD} component={EditLeadScreen} />
        <Stack.Screen
          name={SCREEN.CREATE_LEAD_NOTE}
          component={CreateLeadNoteScreen}
        />
        <Stack.Screen name={SCREEN.CAMERA} component={CameraScreen} />
        <Stack.Screen name={SCREEN.NETWORK_LOGGER} component={LoggerScreen} />
        <Stack.Screen
          name={SCREEN.POS_ORDERS_LIST}
          component={PosOrdersListScreen}
        />
        <Stack.Screen
          name={SCREEN.POS_ORDERS_FILTER}
          component={PosOrdersFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.POS_ORDER_DETAIL}
          component={PosOrderDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_POS_ORDER}
          component={CreatePosOrderScreen}
        />
        <Stack.Screen
          name={SCREEN.EDIT_POS_ORDER}
          component={EditPosOrderScreen}
        />
        <Stack.Screen
          name={SCREEN.SALE_ORDERS_LIST}
          component={SaleOrdersListScreen}
        />
        <Stack.Screen
          name={SCREEN.SALE_ORDER_DETAIL}
          component={SaleOrderDetailScreen}
        />
        <Stack.Screen name={SCREEN.MAP} component={MapScreen} />
        <Stack.Screen name={SCREEN.TAGS} component={TagsScreen} />
        <Stack.Screen name={SCREEN.WEBVIEW} component={WebViewScreen} />
        <Stack.Screen
          name={SCREEN.CALENDAR_RANGE_PICKER}
          component={FlashCalendarScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_SALE_ORDER}
          component={CreateSaleOrderScreen}
        />
        <Stack.Screen
          name={SCREEN.EDIT_SALE_ORDER}
          component={EditSaleOrderScreen}
        />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_LIST}
          component={StockInventoryListScreen}
        />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_FILTER}
          component={StockInventoryFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_FORM}
          component={StockInventoryFormScreen}
        />
        <Stack.Screen name={SCREEN.STOCKTAKING} component={StocktakingScreen} />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_DETAIL}
          component={StockInventoryDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_PRODUCTS}
          component={StockInventoryProductsScreen}
        />
        <Stack.Screen
          name={SCREEN.STOCK_INVENTORY_PRODUCT_DETAIL}
          component={StockInventoryProductDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CODE_SCANNER}
          component={CodeScannerScreen}
        />
        <Stack.Screen
          name={SCREEN.PRODUCTS_PICKER}
          component={ProductsPickerScreen}
        />
        <Stack.Screen
          name={SCREEN.RESET_PASSWORD}
          component={ResetPasswordScreen}
        />
        <Stack.Screen
          name={SCREEN.PROMOTIONS_LIST}
          component={PromotionsListScreen}
        />
        <Stack.Screen
          name={SCREEN.PROMOTION_DETAIL}
          component={PromotionDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.PROMOTIONS_FILTER}
          component={PromotionsFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.PROMOTIONS_PICKER}
          component={PromotionsPickerScreen}
        />
        <Stack.Screen
          name={SCREEN.PROMOTION_GIFTS_PICKER}
          component={PromotionGiftPickerScreen}
        />
        <Stack.Screen
          name={SCREEN.CUSTOMERS_PICKER}
          component={CustomersPickerScreen}
        />
        <Stack.Screen
          name={SCREEN.USERS_PICKER}
          component={UsersPickerScreen}
        />
        <Stack.Screen
          name={SCREEN.CHECK_IN_OUT_EXPLANATIONS_LIST}
          component={CheckInOutExplanationsListScreen}
        />
        <Stack.Screen
          name={SCREEN.CHECK_IN_OUT_EXPLANATION_DETAIL}
          component={CheckInOutExplanationDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_CHECK_IN_OUT_EXPLANATION}
          component={CreateCheckInOutExplanationScreen}
        />
        <Stack.Screen
          name={SCREEN.AVAILABLE_INVENTORY_REPORT}
          component={AvailableInventoryReportScreen}
        />
        <Stack.Screen
          name={SCREEN.ATTENDANCE_LIST}
          component={AttendanceListScreen}
        />
        <Stack.Screen
          name={SCREEN.ATTENDANCES_FILTER}
          component={AttendancesFilterScreen}
        />
        <Stack.Screen
          name={SCREEN.ATTENDANCE_DETAIL}
          component={AttendanceDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.TIMEKEEPING_EXPLANATION_LIST}
          component={TimekeepingExplanationListScreen}
        />
        <Stack.Screen
          name={SCREEN.TIMEKEEPING_EXPLANATION_DETAIL}
          component={TimekeepingExplanationDetailScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_TIMEKEEPING_EXPLANATION}
          component={CreateTimekeepingExplanationScreen}
        />
        <Stack.Screen
          name={SCREEN.ROUTER_TRACKING}
          component={RouterTrackingScreen}
        />
        <Stack.Screen
          name={SCREEN.BANK_ACCOUNTS_LIST}
          component={BankAccountsListScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_BANK_ACCOUNT}
          component={CreateBankAccountScreen}
        />
        <Stack.Screen
          name={SCREEN.EDIT_BANK_ACCOUNT}
          component={EditBankAccountScreen}
        />
        <Stack.Screen
          name={SCREEN.RETURN_PRODUCTS_LIST}
          component={ReturnProductListScreen}
        />
        <Stack.Screen
          name={SCREEN.CREATE_RETURN_PRODUCT}
          component={CreateReturnProductScreen}
        />
        <Stack.Screen
          name={SCREEN.RETURN_PRODUCT_DETAIL}
          component={ReturnProductDetailScreen}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name={SCREEN.DETECT_LOCATION}
          component={DetectLocationScreen}
          options={{ presentation: 'fullScreenModal' }}
        />
        <Stack.Screen
          name={SCREEN.PHOTO_VIEWER}
          component={PhotoViewerScreen}
          options={{
            presentation: 'containedTransparentModal',
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name={SCREEN.MULTI_SELECT}
          component={MultiSelectScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppNavigator;
