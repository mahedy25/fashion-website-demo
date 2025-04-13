'use server'
import { ISettingInput } from '@/types'


import { cookies } from 'next/headers'
import { connectToDatabase } from '..'
import Setting from '../models/setting.model'
import data from '@/lib/data'
import { formatError } from '@/lib/utils'

const globalForSettings = global as unknown as {
  cachedSettings: ISettingInput | null
}
export const getNoCachedSetting = async (): Promise<ISettingInput> => {
  await connectToDatabase()
  const setting = await Setting.findOne()
  return JSON.parse(JSON.stringify(setting)) as ISettingInput
}

export const getSetting = async (): Promise<ISettingInput> => {
  if (!globalForSettings.cachedSettings) {
    console.log('hit db')
    await connectToDatabase()
    const setting = await Setting.findOne().lean()
    globalForSettings.cachedSettings = setting
      ? JSON.parse(JSON.stringify(setting))
      : data.settings[0]
  }
  return globalForSettings.cachedSettings as ISettingInput
}

export const updateSetting = async (newSetting: ISettingInput) => {
    try {
      await connectToDatabase()
  
      const existingSetting = await Setting.findOne()
  
      const updatedSetting = await Setting.findOneAndUpdate(
        { _id: existingSetting?._id }, // Ensure we're updating the correct doc
        { $set: newSetting },
        { upsert: true, new: true }
      ).lean()
  
      globalForSettings.cachedSettings = JSON.parse(JSON.stringify(updatedSetting))
  
      return {
        success: true,
        message: 'Setting updated successfully',
      }
    } catch (error) {
      console.log('Error updating setting:', error)
      return { success: false, message: formatError(error) }
    }
  }
  

// Server action to update the currency cookie
export const setCurrencyOnServer = async (newCurrency: string) => {
  'use server'
  const cookiesStore = await cookies()
  cookiesStore.set('currency', newCurrency)

  return {
    success: true,
    message: 'Currency updated successfully',
  }
}