import { InteractionManager, StyleSheet, View, ViewProps, TextInput } from 'react-native';
import React, { FC, useCallback, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HStack from '@app/components/HStack';
import PriceUtils from '@core/utils/PriceUtils';
import { colors } from '@core/constants/colors.constant';
import Text from '@core/components/Text';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '@app/hooks/useAuth';
import { useSummaryReport } from '@app/queries/home.query';

interface Props extends ViewProps {}

const STORAGE_KEYS = {
  DAILY_REVENUE: '@home_revenue_daily_v1',
  MONTHLY_REVENUE: '@home_revenue_monthly_v1',
};

const HomeRevenue: FC<Props> = ({ style, ...props }) => {
  const user = useAuth(state => state.user);

  const { data, refetch } = useSummaryReport();

  const [dailyRevenue, setDailyRevenue] = useState('');
  const [monthlyRevenue, setMonthlyRevenue] = useState('');

  // Load saved values when component mounts
  useEffect(() => {
    const loadSavedValues = async () => {
      try {
        const savedDaily = await AsyncStorage.getItem(STORAGE_KEYS.DAILY_REVENUE);
        const savedMonthly = await AsyncStorage.getItem(STORAGE_KEYS.MONTHLY_REVENUE);
        
        if (savedDaily) setDailyRevenue(savedDaily);
        if (savedMonthly) setMonthlyRevenue(savedMonthly);
      } catch (error) {
        console.error('Error loading saved revenue values:', error);
      }
    };

    loadSavedValues();
  }, []);

  // Save values whenever they change
  const saveDailyRevenue = async (value: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DAILY_REVENUE, value);
      setDailyRevenue(value);
    } catch (error) {
      console.error('Error saving daily revenue:', error);
    }
  };

  const saveMonthlyRevenue = async (value: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.MONTHLY_REVENUE, value);
      setMonthlyRevenue(value);
    } catch (error) {
      console.error('Error saving monthly revenue:', error);
    }
  };

  const calculateTotal = () => {
    const daily = parseFloat(dailyRevenue.replace(/[^0-9.-]+/g, '')) || 0;
    const monthly = parseFloat(monthlyRevenue.replace(/[^0-9.-]+/g, '')) || 0;
    return daily + monthly;
  };

  useFocusEffect(
    useCallback(() => {
      const task = InteractionManager.runAfterInteractions(() => {
        if (user?.id) refetch();
      });

      return () => task.cancel();
    }, [user]),
  );

  return (
    <View style={[styles.container, style]} {...props}>
      <View style={styles.summary}>
        <HStack>
          <Text style={styles.title}>Doanh số ngày</Text>
          <TextInput
            style={styles.input}
            value={dailyRevenue}
            onChangeText={saveDailyRevenue}
            keyboardType="numeric"
            placeholder="Nhập doanh số ngày"
            placeholderTextColor={colors.color6B7A90}
          />
        </HStack>
        <HStack>
          <Text style={styles.title}>Doanh số tháng</Text>
          <TextInput
            style={styles.input}
            value={monthlyRevenue}
            onChangeText={saveMonthlyRevenue}
            keyboardType="numeric"
            placeholder="Nhập doanh số tháng"
            placeholderTextColor={colors.color6B7A90}
          />
        </HStack>
        <HStack>
          <Text style={styles.title}>Doanh số tổng</Text>
          <Text style={styles.revenue}>
            {PriceUtils.format(calculateTotal())}
          </Text>
        </HStack>
      </View>

      <View style={styles.separator} />

      <HStack style={styles.items}>
        <View style={styles.item}>
          <Text style={styles.label}>Đơn hàng</Text>
          <Text style={styles.text}>
            {PriceUtils.format(data?.total_new_sales || 0, '')}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Điểm ghé thăm</Text>
          <Text style={styles.text}>
            {data?.total_store} / {data?.total_plan}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Khách mới</Text>
          <Text style={styles.text}>
            {PriceUtils.format(data?.total_sale || 0, '')}
          </Text>
        </View>
      </HStack>
    </View>
  );
};

export default HomeRevenue;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 9,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  summary: {
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  revenue: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    color: colors.primary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.colorECEEF2,
  },
  items: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  label: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.color6B7A90,
  },
  text: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'right',
    color: colors.primary,
    padding: 0,
    marginLeft: 8,
  },
});
