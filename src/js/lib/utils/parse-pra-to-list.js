const praForErrorMessage = {
  1: 'Play type',
  2: 'Average bet',
  4: 'Actual win/loss',
  8: 'Average too small override is defined',
  16: 'Average too big override is defined',
  32: 'Proportion of games played',
  64: 'Average cash bet too small override',
  128: 'Average cash bet too big override',
  256: 'Turnover metered value',
  512: 'Table minimum',
  1024: 'Drop per player',
  2048: 'Overage per player',
  4096: 'Override rejection of a duration longer than the maximum table rating session duration defined in Miscellaneous Parameters Maintenance',
  8192: 'Override rejection of a ratin session not wholly contained in the open time of the gaming table',
}

const praForClockOutValues = {
  1: 'playTypeNumber',
  2: 'averageBet',
  4: 'actualWin',
  8: '', // clock-out values 目前用不到, 'Average too small override is defined',
  16: '', // clock-out values 目前用不到, 'Average too big override is defined',
  32: 'propPlay',
  64: '', // clock-out values 目前用不到, 'Average cash bet too small override',
  128: '', // clock-out values 目前用不到, 'Average cash bet too big override',
  256: '', // clock-out values 目前用不到, 'Turnover metered value',
  512: '', // clock-out values 目前用不到, 'Table minimum',
  1024: 'drop',
  2048: '', // clock-out values 目前用不到, 'Overage per player',
  4096: '', // clock-out values 目前用不到, 'Override rejection of a duration longer than the maximum table rating session duration defined in Miscellaneous Parameters Maintenance',
  8192: '', // clock-out values 目前用不到, 'Override rejection of a ratin session not wholly contained in the open time of the gaming table',
}

const parsePraToList = (pra, result = []) => {
  if (pra === 0) return result

  let powNumber = 0

  while (pra >= Math.pow(2, powNumber)) {
    powNumber++
  }

  result.push(Math.pow(2, powNumber - 1))
  return parsePraToList(pra - Math.pow(2, powNumber - 1), result).sort((a, b) => a - b)
}

export const parsePraListToBitValues = pra => {
  return parsePraToList(pra).map(item => praForErrorMessage[item])
}

export const parsePraListToClockOutField = pra => {
  return parsePraToList(pra).map(item => praForClockOutValues[item])
}
