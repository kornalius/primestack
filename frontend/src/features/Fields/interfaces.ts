import { AnyData } from '@/shared/interfaces/commons'

export interface AddOption {
  label: string
  value: string
  icon?: string
  disabled?: boolean
  paid?: boolean
}

export interface Column {
  field: string
  size?: number
  filterable?: boolean
  class?: string | string[] | AnyData
  style?: string | string[] | AnyData
  title?: string
  titleClass?: string | string[] | AnyData
  titleStyle?: string | string[] | AnyData
}

export interface Pagination {
  /**
   * Column name (from column definition)
   */
  sortBy?: string | null
  /**
   * Is sorting in descending order?
   */
  descending?: boolean
  /**
   * Page number (1-based)
   */
  page?: number
  /**
   * How many rows per page? 0 means Infinite
   */
  rowsPerPage?: number
  /**
   * For server-side fetching only. How many total database rows are there to be added to the table.
   * If set, causes the QTable to emit @request when data is required.
   */
  rowsNumber?: number
}

export const ValueBoxSize = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
]

export const ValueBoxFormatStyle = [
  'currency',
  'decimal',
  'percent',
]

export const ValueBoxTextStyle = [
  'subtitle1',
  'subtitle2',
  'body1',
  'body2',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'caption',
  'overline',
]

export const validCurrencyCodes = [
  'USD',
  'CAD',
  'EUR',
  'AUD',
  'AED',
  'AFN',
  'ALL',
  'AMD',
  'ANG',
  'AOA',
  'ARS',
  'AWG',
  'AZN',
  'BAM',
  'BBD',
  'BDT',
  'BGN',
  'BHD',
  'BIF',
  'BMD',
  'BND',
  'BOB',
  'BOV',
  'BRL',
  'BSD',
  'BTN',
  'BWP',
  'BYN',
  'BZD',
  'CDF',
  'CHE',
  'CHF',
  'CHW',
  'CLF',
  'CLP',
  'CNY',
  'COP',
  'COU',
  'CRC',
  'CUC',
  'CUP',
  'CVE',
  'CZK',
  'DJF',
  'DKK',
  'DOP',
  'DZD',
  'EGP',
  'ERN',
  'ETB',
  'FJD',
  'FKP',
  'GBP',
  'GEL',
  'GHS',
  'GIP',
  'GMD',
  'GNF',
  'GTQ',
  'GYD',
  'HKD',
  'HNL',
  'HTG',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'IQD',
  'IRR',
  'ISK',
  'JMD',
  'JOD',
  'JPY',
  'KES',
  'KGS',
  'KHR',
  'KMF',
  'KPW',
  'KRW',
  'KWD',
  'KYD',
  'KZT',
  'LAK',
  'LBP',
  'LKR',
  'LRD',
  'LSL',
  'LYD',
  'MAD',
  'MDL',
  'MGA',
  'MKD',
  'MMK',
  'MNT',
  'MOP',
  'MRU',
  'MUR',
  'MVR',
  'MWK',
  'MXN',
  'MXV',
  'MYR',
  'MZN',
  'NAD',
  'NGN',
  'NIO',
  'NOK',
  'NPR',
  'NZD',
  'OMR',
  'PAB',
  'PEN',
  'PGK',
  'PHP',
  'PKR',
  'PLN',
  'PYG',
  'QAR',
  'RON',
  'RSD',
  'RUB',
  'RWF',
  'SAR',
  'SBD',
  'SCR',
  'SDG',
  'SEK',
  'SGD',
  'SHP',
  'SLE',
  'SLL',
  'SOS',
  'SRD',
  'SSP',
  'STN',
  'SVC',
  'SYP',
  'SZL',
  'THB',
  'TJS',
  'TMT',
  'TND',
  'TOP',
  'TRY',
  'TTD',
  'TWD',
  'TZS',
  'UAH',
  'UGX',
  'USN',
  'UYI',
  'UYU',
  'UYW',
  'UZS',
  'VED',
  'VES',
  'VND',
  'VUV',
  'WST',
  'XAF',
  'XAG',
  'XAU',
  'XBA',
  'XBB',
  'XBC',
  'XBD',
  'XCD',
  'XDR',
  'XOF',
  'XPD',
  'XPF',
  'XPT',
  'XSU',
  'XTS',
  'XUA',
  'XXX',
  'YER',
  'ZAR',
  'ZMW',
  'ZWL',
]
