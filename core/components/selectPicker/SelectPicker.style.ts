import { colors } from '@core/constants/colors.constant';
import dimensions from '@core/constants/dimensions.constant';
import { StyleSheet } from 'react-native';
import { getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';

export default StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  container: {
    backgroundColor: colors.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingBottom: isIphoneX() ? getBottomSpace() : 16,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 14,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.colorE3E5E8,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 24,
    color: colors.black,
    textAlign: 'center',
  },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  content: {
    minHeight: 40 + getBottomSpace(),
    maxHeight: dimensions.height * 0.5,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
  },
  optionIcon: {
    marginRight: 16,
  },
  selectedIcon: {},
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: colors.color161616,
    lineHeight: 22,
  },
  separator: {
    borderBottomWidth: 1,
    borderColor: colors.colorDADADA,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#B8B8B857',
    margin: 16,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8
  },
  searchInput: {
    color: colors.color161616,
    fontWeight: '400',
    fontSize: 14,
    flex: 1,
    padding: 0,
  },
});
