import * as React from "react";

import BigNumber from "bignumber.js";
import { Display } from "./display";
import { Keypad } from "./keypad";
import { Payment } from "./payment";

const language = window.navigator.userLanguage || window.navigator.language;

export interface BchInputProps {
  companyName: string;
  markValid: Function;
  markInvalid: Function;
}

interface BchInputState {
  floatVal: number;
  bigNumber: any;
  stringValue: string;
  currency: string;
  decimalPressed: boolean;
  selectedPaymentType: object;
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

  componentDidMount = () => {
    this.setStringValue();
    this.getFiatDecimalPlaces();
  };

  getFiatDecimalPlaces = () => {
    const { currency } = this.state;
    const string = new Intl.NumberFormat(language, {
      style: "currency",
      currency: currency
    }).formatToParts(1);

    const length = string[3].value.length;
    return length;
  };

  setStringValue = () => {
    const { currency, floatVal, bigNumber } = this.state;

    const length: number = this.getFiatDecimalPlaces();
    const big = new BigNumber(floatVal);
    const fixed: any = big.toFixed(length);

    const string = new Intl.NumberFormat(language, {
      style: "currency",
      currency: currency
    }).format(fixed);

    this.setState({ stringValue: string });
  };

  updateInput = async (val: number) => {
    await this.updateIntVal(val);
    await this.setStringValue();
    this.checkValid();
  };

  deleteInput = async () => {
    const { floatVal } = this.state;
    const string = floatVal.toString().slice(0, -1);

    const int = parseFloat(string);
    const big = new BigNumber(string);
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

  render(): JSX.Element {
    const { companyName } = this.props;
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
        />
      </div>
    );
  }
}

export default BchInput;
