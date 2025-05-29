import HStack from '@app/components/HStack';
import Input from '@app/components/Input';
import PhotoInput from '@app/components/PhotoInput';
import { SCREEN } from '@app/enums/screen.enum';
import { useCustomerDetail } from '@app/queries/customer.query';
import { useExhibitionGroupsList } from '@app/queries/exhibition-group.query';
import { useSlaShowcasesList } from '@app/queries/sla-showcase.query';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import Button from '@core/components/Button';
import Header from '@core/components/Header';
import Text from '@core/components/Text';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { find, findIndex, identity } from 'lodash';
import React, { FC, useEffect, useState } from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@tanstack/react-query';
import ExhibitionRepo from '@app/repository/exhibition/ExhibitionRepo';
import ApiErp from '@app/api/ApiErp';
import Alert from '@core/components/popup/Alert';
import { useAuth } from '@app/hooks/useAuth';
import { CreateShowcaseDeclarationDto } from '@app/interfaces/dtos/showcase-declaration.dto';
import { ErpSlaShowcase } from '@app/interfaces/entities/erp-sla-showcase.entity';
import { GroupExhibition } from '@app/interfaces/entities/group-exhibition.entity';
import UploadUtils from '@core/utils/UploadUtils';
import Touchable from '@core/components/Touchable';
import {
  confirmShowcaseMutation,
  createShowcaseMutation,
} from '@app/queries/showcase-declaration.mutation';
import { queryClient } from 'App';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_SHOWCASE_DECLARATION
>;

export type ShowcaseImageGroups = {
  group: GroupExhibition;
  images: string[];
};

export type ShowcaseDeclarationViewModel = {
  slaShowcase?: ErpSlaShowcase;
  imageGroups?: ShowcaseImageGroups[];
};

const CreateShowcaseDeclarationScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const { storeId, onCreated, routeSchedule } = route.params || {};

  const createMutation = createShowcaseMutation();
  const confirmMutation = confirmShowcaseMutation();

  const userId = useAuth(state => state.user?.id);
  const { data: storeData } = useCustomerDetail(storeId);
  const { data: exhibitionGroups } = useExhibitionGroupsList();
  const { data: slaShowcasesList } = useSlaShowcasesList();

  const [data, setData] = useState<ShowcaseDeclarationViewModel>({
    imageGroups: [],
  });

  useEffect(() => {
    if (!data?.slaShowcase && slaShowcasesList?.[0])
      setData({ ...data, slaShowcase: slaShowcasesList?.[0] });
  }, [slaShowcasesList]);

  const onChangeSlaShowcase = (slaShowcase: ErpSlaShowcase) => {
    setData({ ...data, slaShowcase });
  };

  const onPressSlaShowcases = () => {
    if (!slaShowcasesList) return;
    const options: Option[] = slaShowcasesList.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn chương trình',
      options,
      onSelected: function (option: Option, data?: any): void {
        const slaShowcase = find(slaShowcasesList, it => it.id === option.key);
        if (!slaShowcase) return;
        onChangeSlaShowcase(slaShowcase);
      },
    });
  };

  const onGroupImageCaptured = (option: Option, path: string) => {
    const imageGroups = [...(data.imageGroups || [])];

    const index = findIndex(data.imageGroups, gr => gr.group.id === option.key);
    if (index < 0) {
      imageGroups.push({
        group: {
          id: Number(option.key),
          name: option.text,
        },
        images: [path],
      });
    } else imageGroups[index].images.push(path);

    setData({ ...data, imageGroups });
  };

  const onPressAddImage = () => {
    if (!exhibitionGroups) return;
    const options: Option[] = exhibitionGroups.map(group => ({
      key: group.id,
      text: group.name,
    }));
    SelectOptionModule.open({
      title: 'Loại hình ảnh',
      options,
      onSelected: function (option: Option, data?: any): void {
        navigation.navigate(SCREEN.CAMERA, {
          onCaptured: (path: string) => {
            onGroupImageCaptured(
              option,
              Platform.select({
                ios: path,
                default: `file://${path}`,
              }),
            );
          },
        });
      },
    });
  };

  const onPressImage = (img: string) => {
    navigation.navigate(SCREEN.SHOWCASE_DECLARATION_IMAGES, {
      imageGroups: data.imageGroups,
    });
  };

  const onPressRemoveImage = (groupIndex: number, imgIndex: number) => {
    const imageGroups = [...(data.imageGroups || [])];
    imageGroups[groupIndex].images.splice(imgIndex, 1);
    setData({ ...data, imageGroups });
  };

  const create = (onSuccess?: (result: any) => void) => {
    if (!userId || !data.imageGroups || !data.slaShowcase) return;

    const showcase: CreateShowcaseDeclarationDto = {
      store_id: Number(storeId),
      sla_showcase_id: data.slaShowcase.id,
      salesperson_id: userId,
      create_uid: userId,
      images_validation_ids: data.imageGroups.map(it => {
        return {
          group_exhibition_id: it.group.id,
          images_ids: it.images,
        };
      }),
    };
    if (routeSchedule) {
      showcase.router_id = routeSchedule.router_id?.[0];
      showcase.router_plan_id = routeSchedule.router_plan_id?.[0];
      showcase.detail_router_plan_id = routeSchedule.id;
      showcase.team_id = routeSchedule.team_id?.[0];
    }
    createMutation
      .mutateAsync(showcase)
      .then(({ response }) => {
        queryClient.refetchQueries({
          queryKey: ['showcase-declarations-list'],
        });
        onSuccess?.(response?.result);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const save = () =>
    create(result => {
      onCreated?.(result);
      navigation.goBack();
    });

  const confirm = () =>
    create(result => {
      const showcase = result?.showcase_declaration?.[0];
      if (!userId || !showcase) return;

      confirmMutation
        .mutateAsync({ id: showcase.id, data: { update_uid: userId } })
        .then(({ response }) => {
          queryClient.refetchQueries({
            queryKey: ['showcase-declarations-list'],
          });
          onCreated?.(response?.result);
          navigation.goBack();
        })
        .catch(err => {
          console.log(err);
        });
    });

  const _renderPhotos = () => {
    return data.imageGroups?.map((it, imgGroupIndex) => {
      return it.images?.map((image, imageIndex) => {
        const _onPress = () => onPressImage(image);

        const _onPressRemove = () =>
          onPressRemoveImage(imgGroupIndex, imageIndex);

        return (
          <Touchable
            key={String(it.group.id + '_' + imageIndex)}
            activeOpacity={1}
            onPress={_onPress}
            style={[styles.imgItemContainer, { marginRight: 12 }]}>
            <Image
              source={{ uri: Boolean(image) ? image : undefined }}
              style={styles.imgItem}
            />
            <Touchable
              activeOpacity={1}
              style={styles.removeItemBtn}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              onPress={_onPressRemove}>
              <Image
                source={images.common.close}
                style={styles.removeItemIcon}
                resizeMode="contain"
              />
            </Touchable>
          </Touchable>
        );
      });
    });
  };

  const address = [
    storeData?.street2,
    storeData?.address_town_id?.[1],
    storeData?.address_district_id?.[1],
    storeData?.address_state_id?.[1],
  ]
    .filter(identity)
    .join(', ');

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
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <HStack style={styles.sectionHeader}>
            <Text style={styles.name} numberOfLines={1} selectable>
              {storeData?.name}
            </Text>
            <View
              style={[styles.state, { backgroundColor: colors.colorEAF4FB }]}>
              <Text style={[styles.stateText]} numberOfLines={1}>
                {storeData?.category?.[1]}
              </Text>
            </View>
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
                {storeData?.representative || storeData?.name} -{' '}
                {storeData?.phone}
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
          style={styles.input}
          editable={false}
          numberOfLines={1}
          rightButtons={[{ icon: images.common.chevronForward }]}
          value={data?.slaShowcase?.name}
          onPress={onPressSlaShowcases}
        />

        <PhotoInput
          title="Ảnh Check trưng bày"
          // error="Chụp tối thiểu 3 ảnh"
          values={data?.imageGroups?.flatMap(gr => gr.images)}
          onPressAdd={onPressAddImage}
          onPressItem={onPressImage}
          onPressRemoveItem={(path: string) => console.log(`remove path`, path)}
          renderValues={_renderPhotos}
          style={{
            marginHorizontal: 16,
            marginTop: 8,
          }}
        />
      </KeyboardAwareScrollView>

      <SafeAreaView edges={['bottom']}>
        <HStack style={styles.footer}>
          <Button
            text="Xác nhận"
            style={styles.btn}
            onPress={confirm}
            loading={createMutation.isPending}
          />
          <Button
            text="Lưu"
            colors={colors.white}
            style={[
              styles.btn,
              { borderWidth: 1, borderColor: colors.primary },
            ]}
            textStyle={{ color: colors.primary }}
            onPress={save}
            loading={createMutation.isPending}
          />
        </HStack>
      </SafeAreaView>
    </View>
  );
};

export default CreateShowcaseDeclarationScreen;

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
    paddingVertical: 8,
    gap: 8,
  },
  btn: {
    flex: 1,
  },
  imgItemContainer: {},
  imgItem: {
    width: 98,
    height: 98,
    borderRadius: 4,
  },
  removeItemBtn: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.white,
    backgroundColor: colors.red,
    position: 'absolute',
    top: -8,
    right: -8,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeItemIcon: {
    flex: 1,
  },
});
