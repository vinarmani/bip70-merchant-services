import * as React from "react";
import { TokenSelection } from "./tokenSelection";

const bchLogo = require("../../bch.png");
const spiceLogo = require("../../spice.svg");

const mockupArray = [
  {
    name: "Bitcoin Cash",
    ticker: "BCH",
    tokenID: "",
    decimal_count: 8,
    imagePath: bchLogo
  },
  {
    tokenID: "4de69e374a8ed21cbddd47f2338cc0f479dc58daa2bbe11cd604ca488eca0ddf",
    imagePath: spiceLogo,
    name: "SPICE",
    ticker: "SPICE",
    decimal_count: 8
  }
];

export interface PaymentProps {
  addSelection: Function;
  selectedPaymentType: {
    name: string;
    ticker: string;
    tokenID: string;
    decimal_count: number;
    imagePath: string;
  };
  constructBip70Payload: Function;
}

interface PaymentState {}

export class Payment extends React.Component<PaymentProps, PaymentState> {
  state: PaymentState = {};

  componentDidMount = async () => {
    // set BCH as default
    const { addSelection } = this.props;
    await addSelection(mockupArray[0]);
  };

  render(): JSX.Element {
    const {
      addSelection,
      selectedPaymentType,
      constructBip70Payload
    } = this.props;
    if (selectedPaymentType === null) {
      return null;
    }

    return (
      <div className="wrapper">
        <h5 className="bch-pay-with">Pay with</h5>
        <div className="bch-input-payment">
          {mockupArray.map((x, i) => {
            const isSelected = selectedPaymentType.ticker === x.ticker;

            return (
              <TokenSelection
                key={i}
                token={x}
                active={isSelected}
                addSelection={addSelection}
                constructBip70Payload={constructBip70Payload}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
