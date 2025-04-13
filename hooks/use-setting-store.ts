import data from '@/lib/data'
import { ClientSetting, SiteCurrency } from '@/types'
import { create } from 'zustand'

interface SettingState {
  setting: ClientSetting
  setSetting: (newSetting: ClientSetting) => void
  getCurrency: () => SiteCurrency
  setCurrency: (currency: string) => void
}

const useSettingStore = create<SettingState>((set, get) => ({
  setting: {
    ...data.settings[0],
    currency: data.settings[0].defaultCurrency || 'USD', // fallback just in case
  } as ClientSetting,
  setSetting: (newSetting: ClientSetting) => {
    set((state) => ({
      setting: {
        ...newSetting,
        currency: newSetting.currency || state.setting.currency,
      },
    }))
  },
  getCurrency: () => {
    const setting = get().setting
    return (
      setting.availableCurrencies.find(
        (c) => c.code === setting.currency
      ) || setting.availableCurrencies[0]
    )
  },
  setCurrency: (currency: string) => {
    set((state) => ({
      setting: {
        ...state.setting,
        currency,
      },
    }))
  },
}))

export default useSettingStore
