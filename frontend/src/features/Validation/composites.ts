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
})
