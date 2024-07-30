import { useState, useEffect } from "react";
import axios from "axios";
import DropDown from "../../Components/DropDown";
import ProgressBar from "../../Components/ProgressBar";
import Loader from "../../Components/Loader";

import { useAnimationFrame } from "../../Hooks/useAnimationFrame";
import { ReactComponent as Transfer } from "../../Icons/Transfer.svg";

import classes from "./Rates.module.css";

import CountryData from "../../Libs/Countries.json";
import countryToCurrency from "../../Libs/CountryCurrency.json";
import TextInput from "../../Components/TextInput";
import {
  calculateAmountWithtMarkup,
  calculateAmountWithoutMarkup,
} from "../../utils/calculateRates";

let countries = CountryData.CountryCodes;

const Rates = () => {
  const [fromCurrency, setFromCurrency] = useState("AU");
  const [toCurrency, setToCurrency] = useState("US");

  const [exchangeRate, setExchangeRate] = useState(0.7456);
  const [markupRate, setMarkupRate] = useState(0.0005);

  const [progression, setProgression] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [amountToConvert, setAmountToConvert] = useState("");
  const [amountWithoutMarkup, setAmountWithoutMarkup] = useState(0);
  const [amountWithMarkup, setAmountWithMarkup] = useState(0);

  const Flag = ({ code }) => (
    <img
      alt={code || ""}
      src={`/img/flags/${code || ""}.svg`}
      width="20px"
      className={classes.flag}
    />
  );

  const fetchData = async () => {
    const sellCurrency = countryToCurrency[fromCurrency];
    const buyCurrency = countryToCurrency[toCurrency];
    if (!loading) {
      setLoading(true);
      setError(null);
      await axios
        .get(
          `https://rates.staging.api.paytron.com/rate/public?sellCurrency=${sellCurrency}&buyCurrency=${buyCurrency}`
        )
        .then(({ data }) => {
          if (data.retailRate) {
            setExchangeRate(data.retailRate);
          }
        })
        .catch((e) => {
          setError(
            `We are unable to determine an FX rate for ${sellCurrency}/${buyCurrency}. Please try again later or contact us if the issue persists.`
          );
        });

      setLoading(false);
    }
  };

  //Fetch api when new currency selected
  useEffect(() => {
    fetchData();
  }, [fromCurrency, toCurrency]);

  // Demo progress bar moving :)
  useAnimationFrame(!loading, (deltaTime) => {
    setProgression((prevState) => {
      if (prevState > 0.998) {
        fetchData();
        return 0;
      }
      return (prevState + deltaTime * 0.0001) % 1;
    });
  });

  const handleRateConversion = (e) => {
    const amountInput = Number(e.target.value);
    if (amountInput && !isNaN(amountInput)) {
      setAmountToConvert(Number(amountInput));
      const amountWithoutMarkup = calculateAmountWithoutMarkup(
        amountInput,
        exchangeRate
      );
      setAmountWithoutMarkup(amountWithoutMarkup);
      const amountWithMarkup = calculateAmountWithtMarkup(
        markupRate,
        exchangeRate,
        amountWithoutMarkup
      );
      setAmountWithMarkup(amountWithMarkup);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.heading}>Currency Conversion</div>
        <div className={classes.rowWrapper}>
          <div>
            <DropDown
              leftIcon={<Flag code={fromCurrency} />}
              label={"From"}
              selected={countryToCurrency[fromCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setFromCurrency(key);
                handleRateConversion();
              }}
              style={{ marginRight: "20px" }}
            />
          </div>

          <div className={classes.exchangeWrapper}>
            <div className={classes.transferIcon}>
              <Transfer height={"25px"} />
            </div>

            {!error && <div className={classes.rate}>{exchangeRate}</div>}
          </div>

          <div>
            <DropDown
              leftIcon={<Flag code={toCurrency} />}
              label={"To"}
              selected={countryToCurrency[toCurrency]}
              options={countries.map(({ code }) => ({
                option: countryToCurrency[code],
                key: code,
                icon: <Flag code={code} />,
              }))}
              setSelected={(key) => {
                setToCurrency(key);
              }}
              style={{ marginLeft: "20px" }}
            />
          </div>
        </div>
        {error && <p>{error}</p>}
        <div>
          <TextInput
            label="Amount"
            value={amountToConvert}
            onChange={handleRateConversion}
          />
          <p>User receives: {amountWithoutMarkup}</p>
          <p>OFX trades at: {amountWithMarkup} </p>
        </div>
        <ProgressBar
          progress={progression}
          animationClass={loading ? classes.slow : ""}
          style={{ marginTop: "20px" }}
        />

        {loading && (
          <div className={classes.loaderWrapper}>
            <Loader width={"25px"} height={"25px"} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Rates;
