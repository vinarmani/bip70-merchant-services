import * as React from "react";

import BigNumber from "bignumber.js";
import axios from "axios";
import { AxiosResponse } from "axios";
import { Display } from "./display";
import { Keypad } from "./keypad";
import { Payment } from "./payment";

const language = window.navigator.userLanguage || window.navigator.language;

export interface BchInputProps {
  companyName: string;
  destinationAddress: string;
  markValid: Function;
  markInvalid: Function;
  updateBip70Payload: Function;
}

interface BchInputState {
  floatVal: number;
  bigNumber: any;
  stringValue: string;
  currency: string;
  decimalPressed: boolean;
  selectedPaymentType: {
    name: string;
    ticker: string;
    tokenID: string;
    decimal_count: number;
    imagePath: string;
  };
}

class BchInput extends React.Component<BchInputProps, BchInputState> {
  state: BchInputState = {
    floatVal: 0,
    bigNumber: {},
    stringValue: "---",
    currency: "USD",
    decimalPressed: false,
    selectedPaymentType: null
  };

  componentDidMount = async () => {
    this.setStringValue();
  };

  getFiatDecimalPlaces = () => {
    const { currency } = this.state;
    const currencyString = new Intl.NumberFormat(language, {
      style: "currency",
      currency: currency
    }).formatToParts(1);

    const length = currencyString[3].value.length;
    return length;
  };

  setStringValue = () => {
    const { currency, floatVal, bigNumber } = this.state;

    const length: number = this.getFiatDecimalPlaces();
    const big = new BigNumber(floatVal);
    const fixed: any = big.toFixed(length);

    const currencyString = new Intl.NumberFormat(language, {
      style: "currency",
      currency: currency
    }).format(fixed);

    this.setState({ stringValue: currencyString });
  };

  updateInput = async (val: number) => {
    await this.updateIntVal(val);
    await this.setStringValue();
    this.checkValid();
    await this.constructBip70Payload();
  };

  deleteInput = async () => {
    const { floatVal } = this.state;
    const floatString = floatVal.toString().slice(0, -1);

    const int = parseFloat(floatString);
    const big = new BigNumber(floatString);
    if (!isNaN(int)) {
      await this.setState({
        floatVal: int,
        bigNumber: big,
        decimalPressed: false
      });
    } else {
      await this.setState({
        floatVal: 0,
        bigNumber: big,
        decimalPressed: false
      });
    }
    await this.setStringValue();
    this.checkValid();
  };

  checkValid = () => {
    const { markValid, markInvalid } = this.props;
    const { bigNumber } = this.state;

    try {
      const value = bigNumber.c[0];
      if (value > 0) {
        markValid();
      }
    } catch (error) {
      markInvalid();
    }
  };

  updateIntVal = async (val: number) => {
    const { floatVal, decimalPressed } = this.state;
    let concat: string;
    concat = `${floatVal}${val}`;

    const canEdit = this.checkCanEdit(concat);

    if (decimalPressed) {
      const containsDecimal = /\./.test(concat);
      if (!containsDecimal) {
        concat = `${floatVal}.${val}`;
      }
    }

    if (canEdit) {
      const big = new BigNumber(concat);

      await this.setState({
        floatVal: parseFloat(concat),
        bigNumber: big
      });
    }
  };

  checkCanEdit = (concat: string) => {
    const length: number = this.getFiatDecimalPlaces();
    let split: any = concat.split(".");
    let decimalPlaces: number = 0;
    if (split[1] !== undefined) {
      decimalPlaces = split[1].length;
    }

    if (decimalPlaces <= length) {
      return true;
    }
    return false;
  };

  handleDecimal = () => {
    const length: number = this.getFiatDecimalPlaces();
    if (length > 0) {
      this.setState({
        decimalPressed: true
      });
    }
  };

  addSelection = async (data: object) => {
    await this.setState({ selectedPaymentType: data });
  };

  getBCHPrice = async () => {
    const {
      data: {
        data: { priceUsd }
      }
    }: AxiosResponse = await axios.get(
      `https://api.coincap.io/v2/assets/bitcoin-cash`
    );

    return priceUsd;
  };

  getSpiceAmount = async (fiatValue: number) => {
    const {
      data: { price }
    }: AxiosResponse = await axios.get(
      `https://api.cryptophyl.com/products/SPICE-BCH/ticker`
    );

    const bchPrice = await this.getBCHPrice();

    const bchCost = fiatValue / parseFloat(bchPrice);

    const spiceAmount = bchCost / price;

    return parseFloat(spiceAmount.toFixed(8));
  };

  constructBip70Payload = async () => {
    const {
      floatVal,
      stringValue,
      selectedPaymentType: { tokenID },
      currency
    } = this.state;
    const { updateBip70Payload } = this.props;
    const decimalPlaces: number = this.getFiatDecimalPlaces();

    const isSLP = tokenID !== "";

    if (isSLP) {
      const spiceAmount = await this.getSpiceAmount(floatVal);

      const slpTxRequest: {
        token_id: string;
        slp_outputs: { address: string; amount: number }[];
      } = {
        token_id: tokenID,
        slp_outputs: [
          { address: this.props.destinationAddress, amount: spiceAmount }
        ]
      };
      return updateBip70Payload(slpTxRequest);
    } else {
      const bchTxRequest: {
        outputs: {
          script?: string;
          amount?: number;
          fiatAmount?: AnyKindOfDictionary;
          address?: string;
        }[];
        currency?: string;
        fiat?: string;
        fiatRate?: number;
      } = {
        fiat: currency,
        outputs: [
          // {
          //   script: "76a914018a532856c45d74f7d67112547596a03819077188ac",
          //   amount: 700
          // },
          {
            address: this.props.destinationAddress,
            fiatAmount: floatVal.toFixed(decimalPlaces)
          }
        ]
      };

      return updateBip70Payload(bchTxRequest);
    }
  };

  render(): JSX.Element {
    const { companyName, markValid } = this.props;
    const { selectedPaymentType } = this.state;
    return (
      <div className="bch-input-container">
        {companyName && <h4 style={{ marginBottom: "4rem" }}>{companyName}</h4>}

        <Display parentState={this.state} />
        <div className="wrapper">
          <Keypad
            updateInput={this.updateInput}
            deleteInput={this.deleteInput}
            handleDecimal={this.handleDecimal}
          />
        </div>
        <Payment
          addSelection={this.addSelection}
          selectedPaymentType={selectedPaymentType}
          constructBip70Payload={this.constructBip70Payload}
        />
      </div>
    );
  }
}

export default BchInput;
