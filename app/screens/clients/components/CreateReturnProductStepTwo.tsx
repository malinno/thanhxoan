import HStack from '@app/components/HStack';
import ListEmpty from '@app/components/ListEmpty';
import Section from '@app/components/Section';
import { SCREEN } from '@app/enums/screen.enum';
import {
  ProposalLineFormData,
  useReturnProductForm,
} from '@app/hooks/useReturnProductForm';
import { ErpProduct as ErpProductBase } from '@app/interfaces/entities/erp-product.entity';
import { ErpProduct as ReturnErpProduct } from '@app/interfaces/entities/return-product.entity';
import { SaleOrder } from '@app/interfaces/entities/sale-order.entity';
import { useProducts } from '@app/queries/product.query';
import { useAccountTaxList } from '@app/queries/return-product.query';
import { TPriceLookup } from '@app/screens/orders/types/price-lookup.type';
import Button from '@core/components/Button';
import Text from '@core/components/Text';
import { colors } from '@core/constants/colors.constant';
import images from '@images';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import { find, isEmpty, isNil, orderBy } from 'lodash';
import React, {
  FC,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import ReturnProposalProductItem from './ReturnProposalProductItem';

interface Props {
  next?: () => void;
  previous?: () => void;
  save?: (callback?: TSaveOrderArguments<SaleOrder>) => void;
}

const CreateReturnProductStepTwo: FC<Props> = ({
  next,
  previous,
  save: saveOrder,
  ...props
}) => {
  const navigation = useNavigation();

  const data = useReturnProductForm(state => state.data);
  const setData = useReturnProductForm(state => state.setData);
  const { data: taxList } = useAccountTaxList();
  const productIds = data.proposal_line_ids?.reduce((prev: number[], line) => {
    prev.push(line.product_id.id);
    return prev;
  }, []);

  const { data: productRecords, refetch: refetchProductPrices } = useProducts(
    {
      pricelist_id: data.pricelist_id?.id,
      enable_sale_search: true,
      product_ids: productIds,
    },
    false, // disable automatic refetching
  );

  const [pricesLookup, setPricesLookup] = useState<TPriceLookup>({});

  useEffect(() => {
    if (!data.pricelist_id?.id || isEmpty(productIds)) return;
    refetchProductPrices();
  }, [data.pricelist_id, productIds]);

  useEffect(() => {
    if (!productRecords) return;

    const now = dayjs();

    const lookup = productRecords.reduce((prev: TPriceLookup, p) => {
      const prices = p.pricelist_ids?.[0]?.item_ids?.filter(
        it =>
          it.product_id.id === p.id &&
          (!it.date_start ||
            dayjs(it.date_start, 'YYYY-MM-DD').isBefore(now)) &&
          (!it.date_end || dayjs(it.date_end, 'YYYY-MM-DD').isAfter(now)),
      );

      if (prices && !isEmpty(prices)) prev[String(p.id)] = prices;
      else prev[String(p.id)] = p.list_price || 0;
      return prev;
    }, {});

    setPricesLookup(lookup);
  }, [productRecords]);

  useEffect(() => {
    if (isEmpty(pricesLookup)) return;

    const updatedLines = [...(data.proposal_line_ids || [])].reduce(
      (prev: ProposalLineFormData[], line) => {
        const lookupValue = pricesLookup[String(line.product_id.id)];
        if (!isNil(lookupValue)) {
          // Tạo bản sao của line để tránh thay đổi trực tiếp
          const updatedLine = { ...line };

          if (typeof lookupValue === 'number') {
            updatedLine.price_unit = lookupValue;
          } else {
            const productPrice = find(
              orderBy(lookupValue, 'min_quantity', 'desc'),
              item => item.min_quantity <= updatedLine.product_uom_qty,
            );
            if (productPrice?.fixed_price)
              updatedLine.price_unit = productPrice?.fixed_price;
          }
          updatedLine.price_subtotal =
            updatedLine.price_unit! * updatedLine.product_uom_qty;
          prev.push(updatedLine);
        }
        return prev;
      },
      [],
    );

    // Kiểm tra xem dữ liệu có thay đổi không trước khi cập nhật
    const hasChanged =
      JSON.stringify(updatedLines) !== JSON.stringify(data.proposal_line_ids);
    if (hasChanged) {
      setData({
        proposal_line_ids: updatedLines,
      });
    }
  }, [pricesLookup]);

  // useEffect(() => {
  //   const promotionLines = parsePromotionLines(
  //     data.lines,
  //     data.promotionProgram,
  //   );
  //   setData({ promotionLines });
  //   if (isEmpty(promotionLines)) setData({ promotionProgram: undefined });
  // }, [data.lines, data.promotionProgram]);

  // Sử dụng useMemo để tính toán tổng tiền và chiết khấu
  const [subtotal, discount] = useMemo(() => {
    return [...(data.proposal_line_ids || [])].reduce(
      (prev, line) => {
        prev[0] += line.price_subtotal || 0;
        prev[1] += (line.discount || 0) * line.product_uom_qty;
        return prev;
      },
      [0, 0],
    );
  }, [data.proposal_line_ids]);

  // Chỉ cập nhật phantramchietkhautongdon khi thực sự thay đổi
  useEffect(() => {
    if (data.phantramchietkhautongdon !== discount) {
      setData({
        phantramchietkhautongdon: discount,
      });
    }
  }, [discount, data.phantramchietkhautongdon]);

  const onLineChanged = useCallback(
    (
      index: number,
      changes: Partial<ProposalLineFormData>,
      hasConfirmedRemovePromotionProgram?: boolean,
    ) => {
      const updatedLines = [...(data.proposal_line_ids || [])];
      updatedLines[index] = { ...updatedLines[index], ...changes };

      // Cập nhật price_subtotal nếu số lượng hoặc đơn giá thay đổi
      if (
        changes.product_uom_qty !== undefined ||
        changes.price_unit !== undefined
      ) {
        const line = updatedLines[index];
        updatedLines[index].price_subtotal =
          (line.price_unit || 0) * line.product_uom_qty;
      }

      setData({
        proposal_line_ids: updatedLines,
      });
    },
    [data.proposal_line_ids, setData],
  );

  const onPressRemoveLine = useCallback(
    (lineIndex: number, line: ProposalLineFormData, hasConfirmed?: boolean) => {
      const newLines = (data.proposal_line_ids || []).reduce(
        (prev: ProposalLineFormData[], it, index) => {
          if (index == lineIndex) return prev;

          prev.push(it);
          return prev;
        },
        [],
      );

      setData({
        proposal_line_ids: newLines,
      });
    },
    [data.proposal_line_ids, setData],
  );

  const onPressAddProducts = useCallback(() => {
    // Lấy danh sách ID sản phẩm đã chọn
    const selectedIds =
      data.proposal_line_ids?.map(line => line.product_id.id) || [];

    navigation.navigate(SCREEN.PRODUCTS_PICKER, {
      multiple: true,
      filter: {
        pricelist_id: data.pricelist_id?.id,
        enable_sale_search: true,
      },
      selectedIds,
      onSelected: (products: ErpProductBase[]) => {
        // Tạo map các sản phẩm đã có
        const oldLinesMap = new Map(
          data.proposal_line_ids?.map(line => [
            String(line.product_id.id),
            { ...line },
          ]) || [],
        );

        // Xử lý danh sách sản phẩm được chọn
        const newLines = products.map(p => {
          // Nếu sản phẩm đã có trong danh sách, sử dụng lại
          const existingLine = oldLinesMap.get(String(p.id));
          if (existingLine) return existingLine;

          // Tạo sản phẩm mới với kiểu dữ liệu chính xác
          const newLine: ProposalLineFormData = {
            product_id: {
              ...p,
              default_code: p.default_code || '',
            } as ReturnErpProduct,
            product_uom_qty: 1,
            price_unit: p.list_price || 0,
            price_subtotal: p.list_price || 0,
            is_gift: false,
            discount: 0,
            tax_id: [], // Mảng rỗng theo đúng định nghĩa của ProposalLineFormData
            ghichu: '',
          };
          return newLine;
        });

        // Cập nhật state
        setData({
          proposal_line_ids: newLines,
          phantramchietkhautongdon: 0,
        });
      },
    });
  }, [data.proposal_line_ids, data.pricelist_id, navigation, setData]);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        bottomOffset={50}
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <Section
          title="Thông tin giao hàng"
          bodyComponent={Fragment}
          style={styles.section}
          rightComponent={
            <HStack style={styles.editBtn} onPress={onPressAddProducts}>
              <Text style={styles.editText}>Thêm sản phẩm</Text>
              <Image
                source={images.client.edit}
                tintColor={colors.primary}
                style={{ width: 16, height: 16 }}
              />
            </HStack>
          }>
          {!data.proposal_line_ids || isEmpty(data.proposal_line_ids) ? (
            <ListEmpty text="Chưa có sản phẩm" />
          ) : (
            data.proposal_line_ids.map((line, index) => (
              <ReturnProposalProductItem
                key={`line_${line.product_id}`}
                index={index}
                data={line}
                style={[styles.lineItem, index === 0 && { marginTop: 0 }]}
                onChange={onLineChanged}
                onRemove={onPressRemoveLine}
                isLastItem={index === (data.proposal_line_ids || []).length - 1}
                taxList={taxList}
              />
            ))
          )}
        </Section>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <HStack style={styles.actions}>
          {/* <Button
            text="Lưu nháp"
            colors={colors.colorDADADA}
            style={styles.button}
          /> */}
          <Button
            text="Xác nhận"
            colors={colors.color2651E5}
            style={styles.button}
            onPress={next}
          />
        </HStack>
      </View>
    </View>
  );
};

export default CreateReturnProductStepTwo;

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    // paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  editBtn: {},
  editText: {
    fontSize: 14,
    fontWeight: '400',
    marginRight: 4,
    color: colors.color2651E5,
  },
  lineItem: {
    marginTop: 12,
  },
  row: {},
  rowTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.color161616,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.color161616,
  },
  actions: {
    gap: 16,
  },
  footer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    // backgroundColor: colors.white,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
