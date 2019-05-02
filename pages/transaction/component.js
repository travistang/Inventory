import React from "react"

import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text
} from "react-native"

import ExportRecordOverlay from "./exportRecordOverlay"
import ImportRecordOverlay from "./importRecordOverlay"

import {
  Background,
  Card,
  Button,
  HeaderComponent,
  TransactionCalendarView,
  TransactionList,
  SpendIncomeBanner
} from "components"
import { colors } from "theme"
const { textPrimary } = colors
import { CommonHeaderStyle } from "utils"

export const navigationOptions = ({ navigation, setState }) => ({
  headerStyle: CommonHeaderStyle,
  headerTitle: <HeaderComponent title="transactions" icon="exchange" />,
  headerRight: (
    <View style={style.headerButtons}>
      <Button
        {...headerButtonConfig}
        onPress={() => setState({ isImportDialogOpen: true })}
        icon="cloud-download"
      />

      <Button
        {...headerButtonConfig}
        onPress={() => setState({ isExportDialogOpen: true })}
        icon="share"
      />
    </View>
  )
})

const headerButtonConfig = {
  type: "clear",
  color: textPrimary
}

const style = StyleSheet.create({
  transactionList: {
    marginHorizontal: 16
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
})

export default function({
  transactions,
  isExportDialogOpen,
  isImportDialogOpen,
  daySelected,
  transactionsOfDay,
  availableSnapshots,

  transactionListTitle,

  fetchTransactionOfMonth,
  fetchAvailableListOfRecords,

  onExportRecordOverlayClose,
  onImportRecordOverlayClose,
  onDaySelected,
  onSnapshotSelected,
  onServerURLChange,
  serverURL
}) {
  return (
    <Background>
      <ExportRecordOverlay
        isOpen={isExportDialogOpen}
        onClose={onExportRecordOverlayClose}
      />
      <ImportRecordOverlay
        isOpen={isImportDialogOpen}
        onClose={onImportRecordOverlayClose}
        availableSnapshots={availableSnapshots}
        onSnapshotSelected={onSnapshotSelected}
        onServerURLChange={onServerURLChange}
        serverURL={serverURL}
        fetchAvailableListOfRecords={fetchAvailableListOfRecords}
      />

      <SpendIncomeBanner transactions={transactionsOfDay} />
      <TransactionCalendarView
        transactionsOfMonth={transactions}
        onDaySelected={onDaySelected}
        selectedDays={[daySelected]}
        onMonthChanged={fetchTransactionOfMonth}
      />
      {daySelected && (
        <TransactionList
          title={transactionListTitle}
          icon="exchange"
          style={style.transactionList}
          transactions={transactionsOfDay}
        />
      )}
    </Background>
  )
}
