import { colors } from "@core/constants/colors.constant";
import { StyleSheet } from "react-native";
import { getBottomSpace, isIphoneX } from "react-native-iphone-x-helper";

export default StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    alignItems: 'center',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: isIphoneX() ? getBottomSpace() : 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  optionIcon: {
    marginRight: 20,
  },
  optionIconHttp: {
    marginRight: 10,
    width: 30,
    height: 30
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: colors.colorE3E5E8,
  },
});