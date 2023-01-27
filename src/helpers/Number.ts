
export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export const isNumber = (value: any) => /^-?[0-9.]+/.test(value)
