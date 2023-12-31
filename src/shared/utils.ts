import * as dinero from "dinero.js"

export const emptyToUndefined = (str: any) => {
  if (str == "" || str == null || str == undefined || str.length == 0) return undefined
  return str
}

export const sanitizar = (str: string) => {
  return str.replace(/\D/g, "")
}

export const isCPFValido = (cpf: string): boolean => {
  // Removendo caracteres não numéricos
  cpf = cpf.replace(/\D/g, "")
  cpf = sanitizar(cpf)

  // Verificando se o CPF possui 11 dígitos
  if (cpf.length !== 11) {
    return false
  }

  // Verificando se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cpf)) {
    return false
  }

  // Validando o primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = soma % 11
  let digitoVerificador = resto < 2 ? 0 : 11 - resto
  if (parseInt(cpf.charAt(9)) !== digitoVerificador) {
    return false
  }

  // Validando o segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = soma % 11
  digitoVerificador = resto < 2 ? 0 : 11 - resto
  if (parseInt(cpf.charAt(10)) !== digitoVerificador) {
    return false
  }

  return true
}

function formatToCurrency(value: any): string {
  const price = dinero({ amount: value, currency: "BRL" })
  return price.toRoundedUnit(2, "HALF_DOWN").toLocaleString("pt-br", { currency: "BRL", minimumFractionDigits: 2 })
}

function unformatCurrency(value: string): number {
  let str = value.replace(/[,.]/g, "")
  return parseInt(str)
}

export { formatToCurrency, unformatCurrency }
