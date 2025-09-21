import React from 'react';
import {StyleSheet, Text, View, ViewStyle, TextStyle} from 'react-native';
import type {Purchase} from '../../../src';
import {buildPurchaseRows} from '../utils/buildPurchaseRows';

type PurchaseDetailsProps = {
  purchase: Purchase;
  containerStyle?: ViewStyle;
  rowStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
};

const PurchaseDetails: React.FC<PurchaseDetailsProps> = ({
  purchase,
  containerStyle,
  rowStyle,
  labelStyle,
  valueStyle,
}) => {
  const rows = React.useMemo(() => buildPurchaseRows(purchase), [purchase]);

  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {rows.map((row) => (
        <View key={`${row.label}-${row.value}`} style={[rowStyle, styles.row]}>
          <Text style={[styles.label, labelStyle]}>{row.label}</Text>
          <Text style={[styles.value, valueStyle]}>{row.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  row: {
    flexDirection: 'column',
    gap: 4,
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e1e7ef',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4a4a4a',
  },
  value: {
    fontSize: 13,
    color: '#1f1f1f',
  },
});

export default PurchaseDetails;
