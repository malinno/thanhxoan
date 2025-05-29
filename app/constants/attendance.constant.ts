import { Route } from 'react-native-tab-view';

export type TAttendancesRoute = Route & {
  from_date?: string;
  to_date?: string;
};

export const ATTENDANCE_TAB_ROUTES: TAttendancesRoute[] = [
  {
    key: 'all',
    title: 'Tất cả',
  },
  {
    key: 'current_week',
    title: 'Tuần này',
  },
  {
    key: 'current_month',
    title: 'Tháng này',
  },
];
