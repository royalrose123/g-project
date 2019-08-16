// import Service from '../service'

class Normalizer {
  static SettingDetail ({ systemSetting, automaticSetting, defaultSetting, isActive }) {
    return {
      systemSettings: systemSetting,
      autoSettings: automaticSetting,
      defaultRecord: defaultSetting,
      isActived: isActive,
    }
  }

  static GetTableList (tableList) {
    return {
      tableList: [
        ...tableList.map(tableItem => {
          return { ...tableItem, selected: false }
        }),
      ],
    }
  }
}

export default Normalizer
