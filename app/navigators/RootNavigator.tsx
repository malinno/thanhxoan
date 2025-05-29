import { CheckInOutCategory } from '@app/enums/check-in-out-category.enum';
import { SCREEN } from '@app/enums/screen.enum';
import { useAuth } from '@app/hooks/useAuth';
import { useDevMode } from '@app/hooks/useDevMode';
import { ErpCustomer } from '@app/interfaces/entities/erp-customer.entity';
import { ErpProduct } from '@app/interfaces/entities/erp-product.entity';
import { ErpRouteSchedule } from '@app/interfaces/entities/erp-route-schedule.entity';
import { RouterStore } from '@app/interfaces/entities/erp-router.entity';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import { ErpUser } from '@app/interfaces/entities/erp-user.entity';
import { PartnerAccountBank } from '@app/interfaces/entities/partner-account-bank.entity';
import { ProductGift } from '@app/interfaces/entities/product-gift.entity';
import { PromotionProgram } from '@app/interfaces/entities/promotion-program.entity';
import { AttendancesFilter } from '@app/interfaces/query-params/attendances.filter';
import { AvailableInventoryReportFilter } from '@app/interfaces/query-params/available-inventory-report';
import { CheckInOutExplanationsFilter } from '@app/interfaces/query-params/check-in-out-explanations.filter';
import { CheckInOutFilter } from '@app/interfaces/query-params/check-in-out.filter';
import { CustomersFilter } from '@app/interfaces/query-params/customers.filter';
import { PosOrdersFilter } from '@app/interfaces/query-params/pos-orders.filter';
import { ProductsFilter } from '@app/interfaces/query-params/products.filter';
import { PromotionProgramsFilter } from '@app/interfaces/query-params/promotion-programs.filter';
import { RoutePlansListFilter } from '@app/interfaces/query-params/route-plans-list.filter';
import { RouteSchedulesFilter } from '@app/interfaces/query-params/route-schedules.filter';
import { SaleOrdersFilter } from '@app/interfaces/query-params/sale-orders.filter';
import { StockInventoriesFilter } from '@app/interfaces/query-params/stock-inventories.filter';
import { TimekeepingExplanationsFilter } from '@app/interfaces/query-params/timekeeping-explanations.filter';
import { UsersFilter } from '@app/interfaces/query-params/users.filter';
import { TLocation } from '@app/screens/address/MapScreen';
import { ShowcaseImageGroups } from '@app/screens/exhibition/CreateShowcaseDeclarationScreen';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import Text from '@core/components/Text';
import { APP_ENVIRONMENT } from '@core/constants/core.constant';
import analytics from '@react-native-firebase/analytics';
import {
  NavigationContainer,
  NavigatorScreenParams,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { isNil } from 'lodash';
import React from 'react';
import { StyleSheet } from 'react-native';
import Config from 'react-native-config';
import DeviceInfo from 'react-native-device-info';
import { MapViewProps } from 'react-native-maps';
import { CodeType } from 'react-native-vision-camera';
import { WebViewProps } from 'react-native-webview';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamsList {}
  }
}

export type TabParamsList = {
  [SCREEN.HOME_TAB]?: {};
  [SCREEN.CLIENTS_TAB]?: {};
  [SCREEN.CREATE_ORDER_TAB]?: {};
  [SCREEN.ORDERS_TAB]?: {};
  [SCREEN.OTHERS_TAB]?: {};
};

export type RootStackParamsList = {
  [SCREEN.BOTTOM_TAB]: NavigatorScreenParams<TabParamsList>;
  [SCREEN.PROFILE]: {};
  [SCREEN.NOTIFICATIONS_LIST]: {};
  [SCREEN.STAFFS_MAP]: {};
  [SCREEN.CLIENTS_FILTER]: {
    filter?: CustomersFilter;
    onChange?: (filter: CustomersFilter) => void;
  };
  [SCREEN.CLIENT_DETAIL]: {
    id: number;
  };
  [SCREEN.CREATE_CLIENT]: {};
  [SCREEN.EDIT_CLIENT]: {
    id: number;
  };
  [SCREEN.CONTACTS_LIST]: {
    customerId: string | number;
  };
  [SCREEN.CONTACT_DETAIL]: {
    id: string | number;
  };
  [SCREEN.CREATE_CONTACT]: {
    customerId: string | number;
  };
  [SCREEN.AGENCIES_LIST]: {
    customerId: string | number;
  };
  [SCREEN.PURCHASED_PRODUCTS_LIST]: {
    customerId: string | number;
  };
  [SCREEN.ROUTE_PLANS_LIST]: {};
  [SCREEN.ROUTE_PLANS_FILTER]: {
    filter?: RoutePlansListFilter;
    onChange?: (filter: RoutePlansListFilter) => void;
  };
  [SCREEN.CREATE_ROUTE_PLAN]: {};
  [SCREEN.ROUTE_STORES_PICKER]: {
    selectedIds?: number[];
    onSelected?: (items: RouterStore[]) => void;
  };
  [SCREEN.ROUTER_LIST]: {};
  [SCREEN.ROUTE_PLAN_DETAIL]: {
    id: string | number;
    initialPage?: number;
  };
  [SCREEN.CREATE_ROUTER]?: {};
  [SCREEN.EDIT_ROUTER]: {
    id: string | number;
  };
  [SCREEN.ROUTE_PLAN_SCHEDULES_LIST]: {
    filter?: RouteSchedulesFilter;
  };
  [SCREEN.ROUTE_SCHEDULES_FILTER]: {
    filter?: RouteSchedulesFilter;
    onChange?: (filter: RouteSchedulesFilter) => void;
  };
  [SCREEN.CREATE_ROUTE_SCHEDULE]: {
    routePlanId?: string | number;
  };
  [SCREEN.CHECK_IN_OUT]: {
    checkInOutId?: string | number;
    routeScheduleId?: string | number;
    storeId?: string | number;
    category?: CheckInOutCategory;
    screenTitle?: string;
  };
  [SCREEN.CHECK_IN_OUT_HISTORIES]: {
    filter?: CheckInOutFilter;
    screenTitle?: string;
  };
  [SCREEN.CHECK_IN_OUT_FILTER]: {
    filter?: CheckInOutFilter;
    onChange?: (filter: CheckInOutFilter) => void;
  };
  [SCREEN.ROUTER_DETAIL]: {
    id: string | number;
  };
  [SCREEN.CAMERA]: {
    onCaptured?: (path: string) => void;
  };
  [SCREEN.NETWORK_LOGGER]: undefined;
  [SCREEN.SHOWCASE_DECLARATIONS]: {
    storeId: string | number;
    routeSchedule?: Partial<ErpRouteSchedule>;
  };
  [SCREEN.SHOWCASE_DECLARATION_DETAIL]: {
    id: string | number;
  };
  [SCREEN.CREATE_SHOWCASE_DECLARATION]: {
    storeId: string | number;
    onCreated?: (data: unknown) => void;
    routeSchedule?: Partial<ErpRouteSchedule>;
  };
  [SCREEN.SHOWCASE_DECLARATION_IMAGES]: {
    imageGroups?: ShowcaseImageGroups[];
  };
  [SCREEN.DETECT_LOCATION]: {};
  [SCREEN.LEADS_LIST]: {};
  [SCREEN.LEAD_DETAIL]: {
    id: string | number;
  };
  [SCREEN.EDIT_LEAD]: {
    leadId: string | number;
  };
  [SCREEN.CREATE_LEAD_NOTE]: {
    leadId: string | number;
  };
  [SCREEN.PHOTO_VIEWER]: { images: string[]; index: number };
  [SCREEN.POS_ORDERS_LIST]: {
    filter?: PosOrdersFilter;
  };
  [SCREEN.POS_ORDERS_FILTER]: {
    filter?: PosOrdersFilter;
    onChange?: (filter: PosOrdersFilter) => void;
  };
  [SCREEN.POS_ORDER_DETAIL]: {
    id?: string | number;
  };
  [SCREEN.CREATE_POS_ORDER]: {
    partnerId?: number;
  };
  [SCREEN.EDIT_POS_ORDER]: {
    id?: string | number;
  };
  [SCREEN.MAP]: Partial<MapViewProps> & {
    screenTitle?: string;
    confirmText?: string;
    location?: TLocation;
    onLocation?: (location: TLocation) => void;
    readOnlyMode?: boolean;
  };
  [SCREEN.TAGS]: {
    selectedIds?: number[];
    onSelected?: (items: ErpTag[]) => void;
  };
  [SCREEN.WEBVIEW]: Partial<WebViewProps> & {
    url: string;
  };
  [SCREEN.CALENDAR_RANGE_PICKER]: {
    fromDate?: number;
    toDate?: number;
    onChangeDateRange?: (date: { fromDate: number; toDate: number }) => void;
    onClose?: () => void;
  };
  [SCREEN.CREATE_SALE_ORDER]: {
    partnerId?: number;
  };
  [SCREEN.EDIT_SALE_ORDER]: {
    id?: string | number;
  };
  [SCREEN.STOCK_INVENTORY_LIST]: {
    filter?: StockInventoriesFilter;
  };
  [SCREEN.STOCK_INVENTORY_FILTER]: {
    filter?: StockInventoriesFilter;
    onChange?: (filter: StockInventoriesFilter) => void;
  };
  [SCREEN.STOCK_INVENTORY_FORM]: {
    id?: string | number;
    agencyId?: string | number;
    checkInOutId?: string | number;
  };
  [SCREEN.STOCK_INVENTORY_PRODUCTS]: {
    id?: string | number;
  };
  [SCREEN.STOCK_INVENTORY_PRODUCT_DETAIL]: {
    id?: string | number;
    productId?: string | number;
  };
  [SCREEN.STOCKTAKING]: {
    id: string | number;
    lineId?: string | number;
    productId: string | number;
  };
  [SCREEN.STOCK_INVENTORY_DETAIL]: {
    id?: string | number;
  };
  [SCREEN.MULTI_SELECT]: {
    title?: string;
    options: Option[];
    onSelected?: (options: Option[]) => void;
  };
  [SCREEN.CODE_SCANNER]: {
    title?: string;
    codeTypes?: CodeType[];
    onCodeRead?: (code: string) => void;
  };
  [SCREEN.PRODUCTS_PICKER]: {
    selectedIds?: number[];
    onSelected?: (products: ErpProduct[]) => void;
    multiple?: boolean;
    submitOnPress?: boolean;
    filter?: ProductsFilter;
  };
  [SCREEN.RESET_PASSWORD]: {};
  [SCREEN.PROMOTIONS_PICKER]: {
    filter?: PromotionProgramsFilter;
    selectedId?: number;
    onSelected?: (promotion?: PromotionProgram) => void;
  };
  [SCREEN.PROMOTION_GIFTS_PICKER]: {
    productGift: ProductGift;
  };
  [SCREEN.SALE_ORDERS_LIST]: {
    filter?: SaleOrdersFilter;
  };
  [SCREEN.SALE_ORDER_DETAIL]: {
    id?: string | number;
  };
  [SCREEN.CUSTOMERS_PICKER]: {
    filter?: CustomersFilter;
    selectedIds?: number[];
    onSelected?: (customers: ErpCustomer[]) => void;
    multiple?: boolean;
    title?: string;
  };
  [SCREEN.PROMOTIONS_LIST]?: {};
  [SCREEN.PROMOTION_DETAIL]: {
    id?: string | number;
  };
  [SCREEN.PROMOTIONS_FILTER]: {
    filter?: PromotionProgramsFilter;
    onChange?: (filter: PromotionProgramsFilter) => void;
  };
  [SCREEN.CHECK_IN_OUT_EXPLANATIONS_LIST]?: {
    filter?: CheckInOutExplanationsFilter;
  };
  [SCREEN.CHECK_IN_OUT_EXPLANATION_DETAIL]?: {
    id?: string | number;
  };
  [SCREEN.CREATE_CHECK_IN_OUT_EXPLANATION]: {
    checkInOutId: number | string;
  };
  [SCREEN.USERS_PICKER]: {
    filter?: UsersFilter;
    selectedIds?: number[];
    onSelected?: (customers: ErpUser[]) => void;
    multiple?: boolean;
    title?: string;
  };
  [SCREEN.AVAILABLE_INVENTORY_REPORT]?: {
    filter?: AvailableInventoryReportFilter;
  };
  [SCREEN.ATTENDANCE_LIST]?: {
    filter?: AttendancesFilter;
  };
  [SCREEN.ATTENDANCES_FILTER]?: {
    filter?: AttendancesFilter;
    onChange?: (filter: AttendancesFilter) => void;
  };
  [SCREEN.ATTENDANCE_DETAIL]: {
    id: string | number;
  };
  [SCREEN.TIMEKEEPING_EXPLANATION_LIST]?: {
    filter?: TimekeepingExplanationsFilter;
  };
  [SCREEN.ROUTER_TRACKING]?: {};
  [SCREEN.TIMEKEEPING_EXPLANATION_DETAIL]: {
    id: string | number;
  };
  [SCREEN.CREATE_TIMEKEEPING_EXPLANATION]: {
    attendanceId: number;
  };
  [SCREEN.BANK_ACCOUNTS_LIST]: {
    customerId: number;
  };
  [SCREEN.CREATE_BANK_ACCOUNT]: {
    customerId: number;
  };
  [SCREEN.EDIT_BANK_ACCOUNT]: {
    customerId: number;
    bankAccount: PartnerAccountBank;
  };
  [SCREEN.RETURN_PRODUCTS_LIST]: {
    partnerId?: number;
  };
  [SCREEN.CREATE_RETURN_PRODUCT]: {
    partnerId?: number;
    id?: number;
  };
  [SCREEN.RETURN_PRODUCT_DETAIL]: {
    partnerId?: number;
    id?: number;
  };
};

export const navigationRef =
  createNavigationContainerRef<RootStackParamsList>();

const RootNavigator = () => {
  const cookies = useAuth(state => state.cookies);

  const isDevMode = useDevMode(state => state.isDevMode);
  const isStaging = Config.ENV === APP_ENVIRONMENT.STAGING;
  const version = DeviceInfo.getVersion();
  const buildNumber = DeviceInfo.getBuildNumber();

  const routeNameRef = React.useRef<string>();

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={async () => {
        const currentRoute = navigationRef.current?.getCurrentRoute();

        const previousRouteName = routeNameRef.current;
        const currentRouteName = currentRoute?.name;

        if (previousRouteName !== currentRouteName) {
          await analytics().logScreenView({
            screen_name: currentRouteName,
            screen_class: currentRouteName,
          });
          console.log(`[Route changed]`, {
            screenName: currentRouteName,
            screenParams: currentRoute?.params,
          });
        }
        routeNameRef.current = currentRouteName;
      }}>
      {!isNil(cookies) ? <AppNavigator /> : <AuthNavigator />}

      {isDevMode && (
        <Text
          style={styles.version}
          onPress={() =>
            // __DEV__ &&
            navigationRef.navigate(SCREEN.NETWORK_LOGGER)
          }>
          {Config.ENV} {version}
          {`\n`}
          {`Build: ${buildNumber}`}
        </Text>
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  version: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
    textAlign: 'right',
    color: 'red',
  },
  updateText: {
    textAlign: 'center',
  },
});

export default RootNavigator;
