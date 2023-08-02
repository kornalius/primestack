import required from './rules/required'
import email from './rules/email'
import phone from './rules/phone'
import alpha from './rules/alpha'
import alphanumeric from './rules/alphanumeric'
import numeric from './rules/numeric'
import integer from './rules/integer'
import float from './rules/float'
import hexadecimal from './rules/hexadecimal'
import uppercase from './rules/uppercase'
import lowercase from './rules/lowercase'
import issn from './rules/issn'
import min from './rules/min'
import max from './rules/max'
import between from './rules/between'
import minLength from './rules/min-length'
import maxLength from './rules/max-length'
import creditcard from './rules/creditcard'
import regex from './rules/regex'
import allow from './rules/allow'
import reject from './rules/reject'
import ean from './rules/ean'
import hexcolor from './rules/hexcolor'
import isbn from './rules/isbn'
import json from './rules/json'
import luhn from './rules/luhn'
import md5 from './rules/md5'
import semver from './rules/semver'
import latlong from './rules/latlong'
import postalcode from './rules/postalcode'

export default () => ({
  required,
  email,
  phone,
  alpha,
  alphanumeric,
  numeric,
  integer,
  float,
  hexadecimal,
  uppercase,
  lowercase,
  issn,
  min,
  max,
  between,
  'min-length': minLength,
  'max-length': maxLength,
  creditcard,
  regex,
  allow,
  reject,
  ean,
  hexcolor,
  isbn,
  json,
  luhn,
  md5,
  semver,
  latlong,
  postalcode,
})
