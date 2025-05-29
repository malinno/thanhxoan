import Input from '@app/components/Input';
import RadioButtonGroup from '@app/components/RadioButtonGroup';
import { CONTACT_TYPES } from '@app/constants/contact-types.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useCustomerDetail } from '@app/queries/customer.query';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.CONTACT_DETAIL>;

const ContactDetailScreen: FC<Props> = ({ route, ...props }) => {
  const { data, isLoading, refetch } = useCustomerDetail(route.params.id);

  return (
    <View style={styles.container}>
      <Header title="Thông tin liên hệ" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }>
        <RadioButtonGroup
          style={{ marginTop: 16 }}
          value={data?.type || CONTACT_TYPES[0].id}
          data={CONTACT_TYPES}
          editable={false}
        />
        <Input
          title="Tên liên hệ"
          style={styles.input}
          editable={false}
          value={data?.name}
        />
        <Input
          title="Chức vụ"
          value={data?.function}
          style={styles.input}
          editable={false}
        />
        <Input
          title="Số điện thoại"
          value={data?.phone}
          style={styles.input}
          editable={false}
        />
        <Input
          title="Địa chỉ"
          value={data?.street2}
          style={styles.input}
          editable={false}
        />
        <Input
          title="Tỉnh/ thành phố"
          //   placeholder="Chọn tỉnh/ thành phố"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.address_state_id?.[1]}
        />
        <Input
          title="Quận/ huyện"
          //   placeholder="Chọn quận/ huyện"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.address_district_id?.[1]}
        />
        <Input
          title="Phường/ xã"
          //   placeholder="Chọn phường/ xã"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.address_town_id?.[1]}
        />
        <Input
          title="Email"
          style={styles.input}
          editable={false}
          value={data?.email}
        />
        <Input
          title="Ghi chú"
          value={data?.comment}
          style={styles.input}
          editable={false}
        />
      </ScrollView>
    </View>
  );
};

export default ContactDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  input: {
    marginTop: 11,
  },
});
