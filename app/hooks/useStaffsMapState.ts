import { EmployeeMap } from '@app/interfaces/entities/employee-map.entity';
import { create } from 'zustand';

type StaffsMapState = {
  query: string;
  setQuery: (query: string) => void;
  onlineStaffs: EmployeeMap[];
  setOnlineStaffs: (staffs: EmployeeMap[]) => void;
  reset: () => void;
};

const INIT_STATE: Partial<StaffsMapState> = {
  query: '',
  onlineStaffs: [],
};

export const useStaffsMapState = create<StaffsMapState>((set, get) => {
  return {
    query: '',
    setQuery: query => set({ query }),
    onlineStaffs: [],
    setOnlineStaffs: staffs => set({ onlineStaffs: staffs }),
    reset: () => set({}),
  };
});
