export const calculateAmountWithoutMarkup = (exchangeRate, amount) => {
  if (
    Number(exchangeRate) &&
    !isNaN(exchangeRate) &&
    Number(amount) &&
    !isNaN(amount)
  ) {
    return amount * exchangeRate;
  }
};

export const calculateAmountWithtMarkup = (
  markupRate,
  exchangeRate,
  amountWithoutMarkup
) => {
  if (
    Number(exchangeRate) &&
    !isNaN(exchangeRate) &&
    Number(markupRate) &&
    !isNaN(markupRate) &&
    Number(amountWithoutMarkup) &&
    !isNaN(amountWithoutMarkup)
  ) {
    const ofxRate = markupRate * exchangeRate;
    return amountWithoutMarkup - ofxRate;
  }
};
