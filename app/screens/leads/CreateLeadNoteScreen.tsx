import { StyleSheet, View } from 'react-native';
import React, { FC, Fragment, useEffect, useState } from 'react';
import Text from '@core/components/Text';
import { SCREEN } from '@app/enums/screen.enum';
import { RootStackParamsList } from '@app/navigators/RootNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '@core/components/Header';
import { colors } from '@core/constants/colors.constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Section from '@app/components/Section';
import SectionRow from '@app/components/SectionRow';
import { useAuth } from '@app/hooks/useAuth';
import dayjs from 'dayjs';
import Input from '@app/components/Input';
import Button from '@core/components/Button';
import { useNavigation } from '@react-navigation/native';
import { updateCustomerMutation } from '@app/queries/customer.mutation';
import Spinner from '@core/components/spinnerOverlay/Spinner';
import { updateLeadMutation } from '@app/queries/lead.mutation';
import { queryClient } from 'App';

type Props = NativeStackScreenProps<
  RootStackParamsList,
  SCREEN.CREATE_LEAD_NOTE
>;

const CreateLeadNoteScreen: FC<Props> = ({ route, ...props }) => {
  const navigation = useNavigation();
  const user = useAuth(state => state.user);

  const mutation = updateLeadMutation();

  const now = dayjs();

  const [note, setNote] = useState('');

  // effects
  useEffect(() => {
    if (mutation.isPending) Spinner.show();
    else Spinner.hide();
    return () => Spinner.hide();
  }, [mutation.isPending]);

  const onPressSave = () => {
    if (!user) return;

    mutation
      .mutateAsync({
        id: route.params.leadId,
        data: {
          update_uid: user?.id,
          note2_ids: {
            create: [
              {
                name: note,
              },
            ],
          },
        },
      })
      .then(response => {
        queryClient.refetchQueries({
          queryKey: ['fetch-lead-histories', route.params.leadId],
        });
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
      });
  };

  return (
    <View style={styles.container}>
      <Header title="Tạo mới ghi chú" />
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section style={[styles.section]} bodyComponent={Fragment}>
          <SectionRow
            title="Người tạo"
            titleProps={{ style: styles.rowTitle }}
            text={user?.name}
            textProps={{ style: styles.rowText }}
          />
          <SectionRow
            title="Ngày tạo"
            titleProps={{ style: styles.rowTitle }}
            text={now.format('DD/MM/YYYY')}
            textProps={{ style: styles.rowText }}
          />
        </Section>

        <Input
          title="Nội dung ghi chú"
          style={styles.input}
          inputStyle={styles.note}
          placeholder="Nhập nội dung ghi chú"
          multiline
          numberOfLines={4}
          maxLength={500}
          textAlignVertical="top"
          value={note}
          onChangeText={setNote}
        />

        <Button text="Lưu" style={styles.saveBtn} onPress={onPressSave} />
      </KeyboardAwareScrollView>
    </View>
  );
};

export default CreateLeadNoteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  section: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.colorEFF0F4,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  rowTitle: {
    flex: undefined,
    fontSize: 14,
    fontWeight: '400',
  },
  rowText: {
    maxWidth: undefined,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
  },
  input: {
    marginTop: 11,
  },
  note: {
    height: 80,
  },
  saveBtn: {
    marginTop: 8,
  },
});
