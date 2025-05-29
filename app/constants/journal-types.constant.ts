import { JournalType } from '@app/enums/journal-type.enum';

type TJournalType = {
  id: JournalType;
  text: string;
};

export const JOURNAL_TYPES: TJournalType[] = [
  {
    id: JournalType.cod,
    text: 'COD',
  },
  {
    id: JournalType.online,
    text: 'Online',
  },
];

export const JOURNAL_TYPE_MAPPING: Record<JournalType, string> = {
  [JournalType.cod]: 'COD',
  [JournalType.online]: 'Online',
};
