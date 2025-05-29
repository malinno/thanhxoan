import CustomerCategoryView from '@app/components/CustomerCategoryView';
import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail } from '@app/queries/customer.query';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { identity, isEmpty } from 'lodash';
import React, { FC, useEffect } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import ClientDetailMenuItem from './components/ClientDetailMenuItem';
import ClientDetailQuickAccess from './components/ClientDetailQuickAccess';
import CommonTagItem from '@app/components/CommonTagItem';
import Button from '@core/components/Button';
import {
  confirmCustomerMutation,
  unconfirmCustomerMutation,
} from '@app/queries/customer.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CLIENT_DETAIL>;

const ClientDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  const { data, isLoading, refetch } = useCustomerDetail(route.params.id);
  const confirmInfoMutation = confirmCustomerMutation();
  const unconfirmInfoMutation = unconfirmCustomerMutation();

  useEffect(() => {
    if (confirmInfoMutation.isPending || unconfirmInfoMutation.isPending)
      Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [confirmInfoMutation.isPending, unconfirmInfoMutation.isPending]);

  const onPressEdit = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.EDIT_CLIENT, { id: data.id });
  };

  const onPressAgenciesList = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.AGENCIES_LIST, { customerId: data.id });
  };

  const onPressBankAccountsList = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.BANK_ACCOUNTS_LIST, { customerId: data.id });
  };

  const onPressContactsList = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.CONTACTS_LIST, { customerId: data.id });
  };

  const onPressPurchasedProductsList = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.PURCHASED_PRODUCTS_LIST, {
      customerId: data.id,
    });
  };

  const onPressInventoryReport = () => {
    if (!data?.id) return;
    navigation.navigate(SCREEN.AVAILABLE_INVENTORY_REPORT, {
      filter: { agency_ids: [data.id] },
    });
  };

  const onPressConfirm = () => {
    if (!data?.id) return;
    confirmInfoMutation.mutate({ id: data.id });
  };

  const onPressUnconfirm = () => {
    if (!data?.id) return;
    unconfirmInfoMutation.mutate({ id: data.id });
  };

  const address = [
    data?.street2,
    data?.address_town_id?.[1],
    data?.address_district_id?.[1],
    data?.address_state_id?.[1],
  ]
    .filter(identity)
    .join(', ');

  const saleDisplayName = [
    data?.crm_lead_user_id?.[1],
    // data?.crm_lead_team_id?.[1],
    // data?.crm_lead_crm_group_id?.[1],
  ]
    .filter(identity)
    .join(' - ');

  const hasCoords =
    Boolean(data?.partner_latitude) && Boolean(data?.partner_longitude);

  return (
    <View style={styles.container}>
      <Header
        title={data?.res_partner_f99id || 'Thông tin khách hàng'}
        rightButtons={[{ icon: images.client.edit, onPress: onPressEdit }]}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }>
        <View style={styles.cover}>
          {Boolean(data?.image_url) && (
            <Image
              source={{
                uri: Boolean(data?.image_url)
                  ? data?.image_url?.concat(
                      `?timestamp=${new Date().getTime()}`,
                    )
                  : undefined,
              }}
              style={{ flex: 1 }}
              resizeMode="cover"
            />
          )}
        </View>

        <View style={styles.overview}>
          <HStack>
            <Text style={[styles.sectionTitle, { flex: 1 }]}>{data?.name}</Text>
            <CustomerCategoryView category={data?.category} />
          </HStack>
          <HStack style={styles.verifyStatus}>
            <Image
              source={
                data?.is_confirmed_info
                  ? images.client.verified
                  : images.client.ban
              }
              style={[
                styles.verifyIcon,
                data?.is_confirmed_info
                  ? { tintColor: colors.primary }
                  : { tintColor: colors.color6B7A90 },
              ]}
            />
            <Text
              style={[
                styles.verifyText,
                { fontWeight: '500' },
                data?.is_confirmed_info
                  ? { color: colors.primary }
                  : { color: colors.color6B7A90 },
              ]}>
              {data?.is_confirmed_info
                ? 'Đã xác thực thông tin'
                : 'Chưa xác thực thông tin'}
            </Text>
          </HStack>
          <HStack style={styles.verifyStatus}>
            <Image
              source={hasCoords ? images.client.verified : images.client.ban}
              style={styles.verifyIcon}
            />
            <Text
              style={[
                styles.verifyText,
                hasCoords && { color: colors.color459407 },
              ]}>
              {hasCoords ? 'Đã xác minh vị trí' : 'Chưa xác minh vị trí'}
            </Text>
          </HStack>

          <ClientDetailQuickAccess data={data} />
        </View>

        <Text
          style={[
            styles.sectionTitle,
            { paddingHorizontal: 16, marginTop: 20 },
          ]}>
          Thông tin liên hệ
        </Text>

        <View style={styles.section}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image source={images.client.call} style={styles.rowIcon} />
            <Text
              style={[
                styles.rowText,
                { fontWeight: '700', color: colors.primary },
              ]}>
              {data?.representative || data?.name} - {data?.phone}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.location} style={styles.rowIcon} />
            <Text style={[styles.rowText]}>{address}</Text>
          </HStack>
        </View>

        <View style={styles.section}>
          <HStack style={[styles.row, { marginTop: 0 }]}>
            <Image
              source={images.othersTab.wayToPinLocation}
              style={styles.rowIcon}
            />
            {!isEmpty(data?.route_id) ? (
              <HStack style={styles.optionsContainer}>
                {data?.route_id?.map((route, index) => {
                  return (
                    <CommonTagItem
                      key={route.id}
                      index={index}
                      data={[route.id, route.name]}
                      removable={false}
                    />
                  );
                })}
              </HStack>
            ) : (
              <Text style={[styles.rowText, { marginLeft: 12 }]}>
                Chưa có thông tin tuyến
              </Text>
            )}
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} style={styles.rowIcon} />
            <Text style={[styles.rowText]}>
              Cấp: {data?.contact_level?.[1]}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} style={styles.rowIcon} />
            <Text style={[styles.rowText]}>
              NPP/ Đại lý cấp trên: {data?.superior_id?.[1]}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.index} style={styles.rowIcon} />
            <Text style={[styles.rowText]}>
              Kênh phân phối: {data?.distribution_channel_id?.[1]}
            </Text>
          </HStack>
          <HStack style={styles.row}>
            <Image source={images.client.user} style={styles.rowIcon} />
            <Text style={[styles.rowText]}>
              NV phụ trách: {saleDisplayName}
            </Text>
          </HStack>
        </View>

        <View style={styles.menuSection}>
          <ClientDetailMenuItem
            icon={images.client.fileUserSolid}
            text={'Danh sách NPP/ Đại lý trực thuộc'}
            onPress={onPressAgenciesList}
          />
          <ClientDetailMenuItem
            icon={images.client.wallet}
            text={'Tài khoản ngân hàng'}
            onPress={onPressBankAccountsList}
          />
          <ClientDetailMenuItem
            icon={images.client.contactCardSolid}
            text={'Danh sách liên hệ'}
            onPress={onPressContactsList}
          />
          <ClientDetailMenuItem
            icon={images.client.cartSolid}
            text={'Sản phẩm đã mua'}
            onPress={onPressPurchasedProductsList}
          />
          <ClientDetailMenuItem
            icon={images.client.cubeSolid}
            text={'Tồn kho'}
            onPress={onPressInventoryReport}
            hasSeparator={false}
          />
        </View>

        <View style={styles.actions}>
          {data?.is_confirmed_info ? (
            <Button
              text="Bỏ xác nhận thông tin"
              colors={colors.white}
              textStyle={{ color: colors.red }}
              style={{ borderWidth: 1, borderColor: colors.red }}
              onPress={onPressUnconfirm}
            />
          ) : (
            <Button text="Xác nhận thông tin" onPress={onPressConfirm} />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default ClientDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: 16,
  },
  cover: {
    height: 235,
    backgroundColor: colors.colorF0F3F4,
  },
  overview: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.color161616,
  },
  badge: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
  verifyStatus: {
    marginTop: 8,
  },
  verifyIcon: {
    marginRight: 4,
  },
  verifyText: {
    flex: 1,
    fontSize: 12,
    color: colors.color161616,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    marginHorizontal: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  row: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  rowIcon: {
    marginTop: 1.5,
  },
  rowText: {
    marginLeft: 16,
    flex: 1,
    color: colors.color161616,
  },
  optionsContainer: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  menuSection: {
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 16,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  actions: {
    marginTop: 24,
    paddingHorizontal: 16,
    gap: 16,
  },
});
