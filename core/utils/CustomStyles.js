import React from 'react';
import { omit, wrap } from 'lodash';
import { StyleSheet, TextInput } from 'react-native';
import getFontFamily from './getFontFamily';
import LayoutUtils from './LayoutUtils';
import { DEFAULT_FONTSIZE } from '../constants/fonts.constant';

let _applyed = {};
export const setCustomText = () => {
  if (_applyed.text) {
    return;
  }
  TextInput.render = wrap(TextInput.render, function (func, ...args) {
    let originTextInput = func.apply(this, args);
    const style = StyleSheet.flatten([originTextInput.props.style]);
    const fontSize = style?.fontSize || DEFAULT_FONTSIZE;
    return React.cloneElement(originTextInput, {
      style: StyleSheet.flatten([
        { padding: 0 },
        omit(style, 'fontWeight', 'fontStyle', 'fontSize'),
        {
          fontFamily: getFontFamily('BeVietnamPro', style),
          fontSize: LayoutUtils.size(fontSize),
          includeFontPadding: false,
        },
      ]),
      allowFontScaling: false,
    });
  });
  _applyed.text = true;
};
