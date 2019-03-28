// Generate password 
export function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`
}

export function makeMemberCode() {
  let code = 'WV'
  const possible = '0123456789'

  for (var i = 0; i < 10; i++)
    code += possible.charAt(Math.floor(Math.random() * possible.length))

  return code
}

const viPhonePrefixRegexp = /^(\+?0|\+?840|\+?84)|\+/

export function removePhonePrefix(phoneNumber) {
  let _result = phoneNumber
  if (phoneNumber) {
    _result =  phoneNumber.replace(viPhonePrefixRegexp, '')
  }
  return _result
}

export function insertPhonePrefix(prefix, phoneNumber) {
  let _result = phoneNumber
  if (phoneNumber) {
    _result = prefix.concat(removePhonePrefix(phoneNumber))
  }
  return _result
}

export const queryPhone = (number) => {
  const phoneWithoutNationCode = insertPhonePrefix('', number)
  const phoneWithPlusPrefix = insertPhonePrefix('+', number)
  const phoneWithZeroPrefix = insertPhonePrefix('0', number)
  const phoneWithPlusZeroPrefix = insertPhonePrefix('+0', number)
  const phoneWithNationCode = insertPhonePrefix('84', number)
  const phoneWithPlusNationCode = insertPhonePrefix('+84', number)
  const phoneWithNationCodeZero = insertPhonePrefix('840', number)
  const phoneWithPlusNationCodeZero = insertPhonePrefix('+840', number)
  return ({
    phoneWithoutNationCode,
    phoneWithPlusPrefix,
    phoneWithZeroPrefix,
    phoneWithPlusZeroPrefix,
    phoneWithNationCode,
    phoneWithPlusNationCode,
    phoneWithNationCodeZero,
    phoneWithPlusNationCodeZero,
  })
}
