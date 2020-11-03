const config = {}

exports.config = ({ pagelink, appdomain, ibi, isi, apn, efr = 1 }) => {
  let hasErrors = false
  if (!pagelink) {
    console.error('DeepLink property "pagelink" not defined')
    hasErrors = true
  }
  if (!appdomain) {
    console.error('DeepLink property "appdomain" not defined')
    hasErrors = true
  }
  if (!ibi) {
    console.error('DeepLink property "ibi" not defined')
    hasErrors = true
  }
  if (!isi) {
    console.error('DeepLink property "isi" not defined')
    hasErrors = true
  }
  if (!apn) {
    console.error('DeepLink property "apn" not defined')
    hasErrors = true
  }

  if (hasErrors) {
    throw new Error('Unable to configure deep-link, missing configuraiton properties.')
  }

  config.pagelink = pagelink
  config.appdomain = appdomain
  config.ibi = ibi
  config.isi = isi
  config.apn = apn
  config.efr = efr
}

exports.build = (path) => {
  const link = `https://${config.appdomain}${path}`
  const ofl = `https://${config.appdomain}${path}`

  return `https://${config.pagelink}/?link=${link}&ibi=${config.ibi}&isi=${config.isi}&apn=${config.apn}&efr=${config.efr}&ofl=${ofl}`
}