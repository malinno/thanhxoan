import { SCREEN } from '@app/enums/screen.enum';
import CreateOrderTab from '@app/screens/orders/CreateOrderTab';
import ClientsTab from '@app/screens/clients/ClientsTab';
import HomeTab from '@app/screens/home/HomeTab';
import OrdersTab from '@app/screens/orders/OrdersTab';
import OthersTab from '@app/screens/others/OthersTab';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image } from 'react-native';
import { TabParamsList } from './RootNavigator';
import MyBottomTabBar from './components/MyBottomTabBar';

const Tab = createBottomTabNavigator<TabParamsList>();

const BottomTabStack = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      tabBar={props => <MyBottomTabBar {...props} />}
      initialRouteName={SCREEN.HOME_TAB}
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.color6B7A90,
        headerShown: false,
      }}>
      <Tab.Screen
        key={SCREEN.HOME_TAB}
        name={SCREEN.HOME_TAB}
        component={HomeTab}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={images.tab.home}
                tintColor={color}
                style={{ width: size, height: size }}
              />
            );
          },
          title: t('tab.home'),
        }}
      />
      <Tab.Screen
        key={SCREEN.CLIENTS_TAB}
        name={SCREEN.CLIENTS_TAB}
        component={ClientsTab}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={images.tab.clients}
                tintColor={color}
                style={{ width: size, height: size }}
              />
            );
          },
          title: t('tab.clients'),
        }}
      />
      <Tab.Screen
        key={SCREEN.CREATE_ORDER_TAB}
        name={SCREEN.CREATE_ORDER_TAB}
        component={CreateOrderTab}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={images.tab.createOrder}
                tintColor={color}
                style={{ width: size, height: size }}
              />
            );
          },
          title: t('tab.create_order'),
        }}
      />
      <Tab.Screen
        key={SCREEN.ORDERS_TAB}
        name={SCREEN.ORDERS_TAB}
        component={OrdersTab}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={images.tab.orders}
                tintColor={color}
                style={{ width: size, height: size }}
              />
            );
          },
          title: t('tab.orders'),
        }}
      />
      <Tab.Screen
        key={SCREEN.OTHERS_TAB}
        name={SCREEN.OTHERS_TAB}
        component={OthersTab}
        options={{
          tabBarIcon: ({ color, size }) => {
            return (
              <Image
                source={images.tab.others}
                tintColor={color}
                style={{ width: size, height: size }}
              />
            );
          },
          title: t('tab.others'),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabStack;
