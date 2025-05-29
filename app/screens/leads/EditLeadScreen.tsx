import HStack from '@app/components/HStack';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import {
  useCrmStages,
  useCrmTags,
  useLeadDetail,
  useLeadHistories,
} from '@app/queries/lead.query';
import Header from '@core/components/Header';
import MyAvatar from '@core/components/MyAvatar';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import LeadPartnerView from './components/LeadPartnerView';
import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import dayjs from 'dayjs';
import Input from '@app/components/Input';
import { ErpTag } from '@app/interfaces/entities/erp-tag.entity';
import { find, isEmpty } from 'lodash';
import LeadTagItem from './components/LeadTagItem';
import NoteItem from './components/NoteItem';
import Button from '@core/components/Button';
import { updateLeadMutation } from '@app/queries/lead.mutation';
import { useAuth } from '@app/hooks/useAuth';
import { ExtendedOption } from '../common/MultiSelectScreen';
import { Option } from '@core/components/selectPicker/SelectPicker.interface';
import { queryClient } from 'App';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import SelectOptionModule from '@core/components/selectPicker/SelectOptionModule';
import dimensions from '@core/constants/dimensions.constant';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.EDIT_LEAD>;

export type EditLeadViewModel = {
  stage?: [number, string];
  tags?: [number, string][];
};

const EditLeadScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = updateLeadMutation();

  // queries
  const {
    data: lead,
    isLoading: isFetchingLead,
    refetch: refetchLeadDetail,
  } = useLeadDetail(route.params.leadId);
  const {
    data: histories,
    isLoading: isFetchingLeadHistories,
    refetch: refetchLeadHistories,
  } = useLeadHistories(route.params.leadId);
  const { data: crmTags } = useCrmTags();
  const { data: crmStages } = useCrmStages();

  // states
  const [data, setData] = useState<EditLeadViewModel>({});

  // effects
  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => {
      Spinner.hide();
    };
  }, [mutation.isPending]);

  useEffect(() => {
    if (!isEmpty(lead?.tags))
      setData(preState => ({
        ...preState,
        stage: lead?.stage_id,
        tags: lead?.tags.map(t => [t.id, t.name]),
      }));
  }, [lead]);

  const onPressStages = () => {
    if (!crmStages) return;
    const options: Option[] = crmStages?.map(it => ({
      key: it.id,
      text: it.name,
    }));
    SelectOptionModule.open({
      title: 'Chọn trạng thái chăm sóc',
      options,
      containerStyle: { minHeight: dimensions.height * 0.5 },
      onSelected: function (option: Option, _?: any): void {
        const stage = find(crmStages, it => it.id === option.key);
        if (!stage) return;
        setData(preState => ({
          ...preState,
          stage: [stage.id, stage.name],
        }));
      },
    });
  };

  const onPressTags = () => {
    if (!crmTags) return;
    const options: ExtendedOption[] = crmTags?.map(it => ({
      key: it.id,
      text: it.name,
      isSelected: Boolean(data.tags?.find(st => st[0] === it.id)),
    }));
    navigation.navigate(SCREEN.MULTI_SELECT, {
      title: 'Chọn thẻ tag',
      options,
      onSelected: (opts: Option[]) => {
        setData({ tags: opts.map(o => [Number(o.key), o.text]) });
      },
    });
  };

  const onPressRemoveTagItem = (index: number) => {
    setData(preState => ({
      ...preState,
      tags: preState.tags?.filter((_, idx) => idx !== index),
    }));
  };

  const onPressCreateNote = () => {
    navigation.navigate(SCREEN.CREATE_LEAD_NOTE, {
      leadId: route.params.leadId,
    });
  };

  const submit = () => {
    if (!user?.id || !lead?.id) return;

    const addTags: number[] = (data.tags || []).map(tag => tag[0]),
      removeTags: number[] = [];

    for (const item of lead.tags || []) {
      const idx = addTags.indexOf(item.id);
      if (idx < 0) removeTags.push(item.id);
      else addTags.splice(idx, 1);
    }

    mutation
      .mutateAsync({
        id: lead.id,
        data: {
          update_uid: user.id,
          stage_id: data.stage?.[0],
          tag_ids: {
            add: !isEmpty(addTags) ? addTags : [],
            remove: !isEmpty(removeTags) ? removeTags : [],
          },
        },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['lead-detail', lead.id],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  const createdAt = lead?.create_date
    ? dayjs(lead.create_date).format('DD/MM/YYYY - HH:mm')
    : '';

  const openAt = lead?.date_open
    ? dayjs(lead.date_open).format('DD/MM/YYYY - HH:mm')
    : '';

  return (
    <View style={styles.container}>
      <Header
        title="Thông tin cơ hội"
        rightButtons={[
          {
            icon: images.common.check,
            onPress: submit,
          },
        ]}
      />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <HStack style={styles.actionsContainer}>
          {/* <Button
            text="Mới"
            colors={colors.white}
            style={styles.actionBtn}
            textStyle={styles.actionBtnText}
          />
          <Button
            text="Đã gọi"
            colors={colors.white}
            style={styles.actionBtn}
            textStyle={styles.actionBtnText}
          /> */}
          <Button
            text={data.stage?.[1]}
            colors={colors.white}
            style={styles.actionBtn}
            textStyle={styles.actionBtnText}
            rightIcon={{
              src: images.common.chevronForward,
              style: {
                tintColor: colors.primary,
                position: 'absolute',
                right: 0,
              },
            }}
            onPress={onPressStages}
          />
        </HStack>

        <HStack style={styles.section}>
          <MyAvatar size={46} name={lead?.name} />
          <View style={{ flex: 1, paddingHorizontal: 16 }}>
            <Text style={{ fontSize: 12, color: colors.color6B7A90 }}>
              Khách hàng
            </Text>
            <Text style={{ marginTop: 6, fontSize: 14, fontWeight: '600' }}>
              {lead?.name}
            </Text>
          </View>
          <Image source={images.common.arrowRight} tintColor={colors.black} />
        </HStack>

        <LeadPartnerView data={lead} style={styles.customer} />

        <Input
          style={styles.input}
          title="Tag"
          editable={false}
          rightButtons={[{ icon: images.common.chevronForward }]}
          onPress={onPressTags}
          renderContent={
            <View style={styles.tags}>
              {isEmpty(data?.tags) ? (
                <Text style={styles.placeholderText}>Chọn từ khóa</Text>
              ) : (
                data?.tags?.map((tag, index) => {
                  return (
                    <LeadTagItem
                      key={tag[0]}
                      index={index}
                      data={tag}
                      onRemove={onPressRemoveTagItem}
                    />
                  );
                })
              )}
            </View>
          }
        />

        <Section style={[styles.section]} bodyComponent={Fragment}>
          <SectionRow
            title="Ngày tạo"
            titleProps={{ style: styles.rowLabel }}
            text={createdAt}
            textProps={{ style: styles.rowText }}
            style={[styles.row, { marginTop: 0 }]}
          />
          <SectionRow
            title="Ngày giao"
            titleProps={{ style: styles.rowLabel }}
            text={openAt}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
        </Section>

        <Section style={[styles.section]} bodyComponent={Fragment}>
          <SectionRow
            title="Nguồn"
            titleProps={{ style: styles.rowLabel }}
            text={lead?.source_id?.[1]}
            textProps={{ style: styles.rowText }}
            style={[styles.row, { marginTop: 0 }]}
          />

          <SectionRow
            title="NVKD"
            titleProps={{ style: styles.rowLabel }}
            text={lead?.user_id?.[1]}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
          <SectionRow
            title="Đội ngũ bán hàng "
            titleProps={{ style: styles.rowLabel }}
            text={lead?.team_id?.[1]}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
          <SectionRow
            title="Công ty con"
            titleProps={{ style: styles.rowLabel }}
            text={lead?.crm_group_id?.[1]}
            textProps={{ style: styles.rowText }}
            style={styles.row}
          />
        </Section>

        <Section
          title="Lịch sử ghi chú"
          titleStyle={{ fontSize: 14 }}
          rightComponent={
            <HStack onPress={onPressCreateNote} style={styles.addBtn}>
              <Text style={styles.addText}>Thêm ghi chú</Text>
              <Image source={images.client.fileDockAdd} />
            </HStack>
          }
          style={[styles.noteSectionContainer]}
          bodyProp={{ style: styles.noteSection }}>
          {!histories ? (
            <Text
              style={{
                margin: 16,
                alignSelf: 'center',
                color: colors.color6B7A90,
              }}>
              Chưa có ghi chú nào
            </Text>
          ) : (
            histories.map((note, index) => {
              return (
                <NoteItem key={index} data={note} style={styles.noteItem} />
              );
            })
          )}
        </Section>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default EditLeadScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  actionsContainer: {
    marginHorizontal: 16,
    gap: 6,
  },
  actionBtn: {
    flex: 1,
    minHeight: undefined,
    height: 42,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  customer: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    marginHorizontal: 16,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: colors.white,
  },
  row: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  rowLabel: {
    fontSize: 14,
    fontWeight: '400',
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color22222280,
    lineHeight: 20,
    marginTop: 6,
  },
  input: {
    marginTop: 8,
    marginHorizontal: 16,
  },
  noteSectionContainer: {
    backgroundColor: 'transparent',
  },
  noteSection: {
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  noteItem: {},
  addBtn: {},
  addText: {
    fontSize: 12,
    fontWeight: '300',
    marginRight: 4,
    color: colors.color2651E5,
  },
});
