import { StockInventoryState } from "@app/enums/stock-inventory-state.enum"
import { colors } from "@core/constants/colors.constant"


export const STOCK_INVENTORY_STATES = [
  {
    id: StockInventoryState.draft,
    text: "Dự thảo",
  },
  {
    id: StockInventoryState.inprogress,
    text: "Đang thực hiện",
  },
  {
    id: StockInventoryState.confirmed,
    text: "Đã xác nhận",
  },
]

export const STOCK_INVENTORY_STATE_MAPPING = {
  [StockInventoryState.draft]: {
    displayText: 'Dự thảo',
    textColor: colors.color16161680,
    backgroundColor: colors.color1616161A
  },
  [StockInventoryState.inprogress]: {
    displayText: 'Đang thực hiện',
    textColor: colors.color2651E5,
    backgroundColor: colors.colorEAF4FB
  },
  [StockInventoryState.confirmed]: {
    displayText: 'Đã xác nhận',
    textColor: colors.color16161680,
    backgroundColor: colors.colorFFECA7
  }
}