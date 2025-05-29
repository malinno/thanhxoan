import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { useLeadDetail, useLeadHistories } from '@app/queries/lead.query';
import Header from '@core/components/Header';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, Fragment } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import LeadPartnerView from './components/LeadPartnerView';
import Section from '@app/components/Section';
import { colors } from '@core/constants/colors.constant';
import HStack from '@app/components/HStack';
import Text from '@core/components/Text';
import SectionRow from '@app/components/SectionRow';
import dayjs from 'dayjs';
import NoteItem from './components/NoteItem';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import MyAvatar from '@core/components/MyAvatar';

type Props = NativeStackScreenProps<RootStackParamsList, SCREEN.LEAD_DETAIL>;

const LeadDetailScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();

  // queries
  const {
    data: lead,
    isLoading: isFetchingLead,
    refetch: refetchLeadDetail,
  } = useLeadDetail(route.params.id);

  const {
    data: histories,
    isLoading: isFetchingLeadHistories,
    refetch: refetchLeadHistories,
  } = useLeadHistories(route.params.id);

  const onPressCustomer = () => {
    if (!lead?.partner?.id) return;
    navigation.navigate(SCREEN.CLIENT_DETAIL, { id: lead?.partner?.id });
  };

  const onPressEdit = () => {
    navigation.navigate(SCREEN.EDIT_LEAD, { leadId: route.params.id });
  };

  const onPressCreateNote = () => {
    navigation.navigate(SCREEN.CREATE_LEAD_NOTE, { leadId: route.params.id });
  };

  const createdAt = lead?.create_date
    ? dayjs(lead.create_date).add(7, 'hours').format('DD/MM/YYYY - HH:mm')
    : '';

  const openAt = lead?.date_open
    ? dayjs(lead.date_open).add(7, 'hours').format('DD/MM/YYYY - HH:mm')
    : '';

  return (
    <View style={styles.container}>
      <Header
        title="Thông tin cơ hội"
        rightButtons={[{ icon: images.client.edit, onPress: onPressEdit }]}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetchingLead}
            onRefresh={refetchLeadDetail}
          />
        }>
        <HStack style={styles.section} onPress={onPressCustomer}>
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

        <Section style={[styles.section]} bodyComponent={Fragment}>
          <SectionRow
            title="Từ khoá"
            titleProps={{
              style: [styles.rowLabel, { flex: undefined, marginTop: 4 }],
            }}
            renderText={() => {
              return (
                <HStack style={styles.tagsContainer}>
                  {lead?.tags?.map((tag, index) => (
                    <View key={tag.id} style={styles.tagItem}>
                      <Text style={styles.tagText}>{tag.name}</Text>
                    </View>
                  ))}
                </HStack>
              );
            }}
            style={[styles.row, { marginTop: 0, alignItems: 'flex-start' }]}
          />

          <SectionRow
            title="Ngày tạo"
            titleProps={{ style: styles.rowLabel }}
            text={createdAt}
            textProps={{ style: styles.rowText }}
            style={styles.row}
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
      </ScrollView>
    </View>
  );
};

export default LeadDetailScreen;

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
  tagsContainer: {
    flex: 1,
    marginLeft: 16,
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  tagItem: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 14,
    backgroundColor: colors.colorEAF4FB,
  },
  tagText: {
    color: colors.color161616,
  },
});
