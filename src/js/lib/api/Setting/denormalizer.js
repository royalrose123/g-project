class Denormalizer {
  static FetchSettingDetail ({ tableNumber }) {
    return {
      tableName: tableNumber,
    }
  }

  static PostSettingDetail ({ systemSettings, autoSettings, defaultRecord }) {
    return {
      automaticSetting: autoSettings,
      defaultRecord: defaultRecord,
      systemSetting: systemSettings,
    }
  }

  static FetchTableList ({ tableList }) {
    return {
      tableList: tableList,
    }
  }

  static ActiveTable ({ selectedTableName }) {
    return {
      tableName: selectedTableName,
    }
  }

  static DeactiveTable ({ tableNumber }) {
    return {
      tableName: tableNumber,
    }
  }
}

export default Denormalizer
