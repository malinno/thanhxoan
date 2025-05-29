import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import PhotoInput from '@app/components/PhotoInput';
import { SHOWCASE_STATE_MAPPING } from '@app/constants/showcase-states.constant';
import { SCREEN } from '@app/enums/screen.enum';
import { ShowcaseState } from '@app/enums/showcase-state.enum';
import { useAuth } from '@app/hooks/useAuth';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { confirmShowcaseMutation } from '@app/queries/showcase-declaration.mutation';
import { useShowcaseDeclarationDetail } from '@app/queries/showcase-declaration.query';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { queryClient } from 'App';
import { identity, isNil } from 'lodash';
import React, { FC, useEffect } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.SHOWCASE_DECLARATION_DETAIL
>;

const ShowcaseDeclarationDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);
  const confirmMutation = confirmShowcaseMutation();

  const { data, isLoading, refetch } = useShowcaseDeclarationDetail(
    route.params.id,
  );

  useEffect(() => {
    if (confirmMutation.isPending) Spinner.show();
    else Spinner.hide();

    return () => Spinner.hide();
  }, [confirmMutation.isPending]);

  const onPressImage = (img: string) => {
    if (!data?.images_validation_ids) return;
    navigation.navigate(SCREEN.SHOWCASE_DECLARATION_IMAGES, {
      imageGroups: data.images_validation_ids.map(it => {
        return {
          group: {
            id: it.group_exhibition_id[0],
            name: it.group_exhibition_id[1],
          },
          images: it.images_ids,
        };
      }),
    });
  };

  const onPressConfirm = () => {
    if (!data || !user) return;
    confirmMutation
      .mutateAsync({ id: data.id, data: { update_uid: user.id } })
      .then(({ response }) => {
        queryClient.refetchQueries({
          queryKey: ['showcase-declarations-list'],
        });
        refetch();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const address = [
    data?.store_id?.street2,
    data?.store_id?.address_town_id?.[1],
    data?.store_id?.address_district_id?.[1],
    data?.store_id?.address_state_id?.[1],
  ]
    .filter(identity)
    .join(', ');

  const imgs = data?.images_validation_ids?.reduce((prev: string[], it) => {
    const urls = it.images_ids.filter(identity);
    prev.push(...urls);
    return prev;
  }, []);

  const state = data?.state ? SHOWCASE_STATE_MAPPING[data?.state] : undefined;

  return (
    <View style={styles.container}>
      <Header
        title="Khai báo trưng bày"
        rightButtons={[
          {
            icon: images.common.homeAlt,
            onPress: () => navigation.dispatch(StackActions.popToTop()),
          },
        ]}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }>
        <View style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Text style={styles.name} numberOfLines={1} selectable>
              {data?.store_id?.name}
            </Text>
            {!isNil(state) && (
              <View
                style={[
                  styles.state,
                  { backgroundColor: state.backgroundColor },
                ]}>
                <Text
                  style={[styles.stateText, { color: state.textColor }]}
                  numberOfLines={1}>
                  {state?.name}
                </Text>
              </View>
            )}
          </HStack>
          <View style={styles.separator} />
          <View style={styles.sectionBody}>
            <HStack style={styles.sectionRow}>
              <Image source={images.client.call} />
              <Text
                style={[
                  styles.sectionText,
                  { fontSize: 14, color: colors.primary, marginTop: 0 },
                ]}
                numberOfLines={1}>
                {data?.store_id?.representative || data?.store_id?.name} -{' '}
                {data?.store_id?.phone}
              </Text>
            </HStack>
            <HStack style={styles.sectionRow}>
              <Image source={images.client.location} />
              <Text style={[styles.sectionText]} numberOfLines={1}>
                {address}
              </Text>
            </HStack>
          </View>
        </View>

        <Input
          title="Chương trình"
          //   placeholder="Chọn quận/ huyện"
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.sla_showcase_id?.[1]}
        />

        <PhotoInput
          title="Ảnh Check trưng bày"
          values={imgs}
          editable={false}
          onPressItem={onPressImage}
          style={{
            marginHorizontal: 16,
            marginTop: 8,
          }}
        />
      </ScrollView>

      {data?.state === ShowcaseState.draft && (
        <HStack entering={FadeIn} exiting={FadeOut} style={styles.footer}>
          <Button
            text="Xác nhận"
            style={styles.btn}
            onPress={onPressConfirm}
            loading={confirmMutation.isPending}
          />
        </HStack>
      )}
    </View>
  );
};

export default ShowcaseDeclarationDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 16,
  },
  section: {
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorE3E5E8,
  },
  sectionHeader: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionBody: {
    paddingVertical: 12,
  },
  name: {
    flex: 1,
    marginRight: 12,
    fontSize: 16,
    fontWeight: '600',
    color: colors.color161616,
  },
  state: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stateText: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: Number(90).adjusted(),
  },
  sectionRow: {
    marginTop: 8,
  },
  sectionText: {
    flex: 1,
    marginLeft: 16,
    color: colors.color161616,
  },
  input: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
  },
  btn: {
    flex: 1,
  },
});
