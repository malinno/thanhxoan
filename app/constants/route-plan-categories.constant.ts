import { RoutePlanCategory } from '@app/interfaces/entities/erp-route-plan.entity';

type TCategory = {
  id: RoutePlanCategory;
  text: string;
};

export const ROUTE_PLAN_CATEGORIES: TCategory[] = [
  {
    id: 'plan',
    text: 'Kế hoạch theo tuyến',
  },
  {
    id: 'audit',
    text: 'Kế hoạch audit',
  },
];
