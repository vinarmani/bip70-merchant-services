import * as React from "react";

import axios from "axios";
import { AxiosResponse } from "axios";
import { Link } from "react-router-dom";
import BchInput from "./bch-input";
import store from "store";

export interface InvoiceProps {
  location: object;
  history: any;
}

interface InvoiceState {
  id: string;
  errorMsg: string;
  merchant: {
    currency: string;
    destinationAddress: string;
    companyName: string;
  };
  bip70Payload: object;
  isValid: boolean;
}

export class Invoice extends React.Component<InvoiceProps, InvoiceState> {
  state: InvoiceState = {
    id: "",
    errorMsg: "",
    merchant: {
      currency: "",
      destinationAddress: "",
      companyName: ""
    },
    bip70Payload: {},
    isValid: false
  };

  componentDidMount = () => {
    this.getMerchantInfo();
  };

  getMerchantInfo = async () => {
    const merchantInfo = store.get("merchant");
    let apiKey: string;
    if (merchantInfo !== undefined) {
      apiKey = merchantInfo.apiKey;
    }

   //const resp = await this.mockApiCall(apiKey);
   const resp = {
    currency: "USD",
    destinationAddress: merchantInfo.settings.address,
    companyName: merchantInfo.name
  }
  console.log('resp', resp)
    this.setState({ merchant: resp });
  };

  mockApiCall = async (apiKey: string) => {
    return {
      currency: "USD",
      destinationAddress: "asdf",
      companyName: "Test Merchant Name"
    };
  };

  updateBip70Payload = (obj: object) => {
    this.setState({ bip70Payload: obj });
  };

  markValid = () => {
    this.setState({ isValid: true });
  };
  markInvalid = () => {
    this.setState({ isValid: false });
  };

  submitPayload = async () => {
    const { bip70Payload } = this.state;

    const {
      history: { push }
    } = this.props;
    const { data }: AxiosResponse = await axios.post(
      `https://pay.bitcoin.com/create_invoice`,
      bip70Payload
    );

    const { paymentId } = data;
    push(`/i/${paymentId}`);
  };

  render(): JSX.Element {
    const {
      merchant,
      isValid,
      bip70Payload
    } = this.state;

    console.log('companyName', merchant.companyName)

    return (
      <React.Fragment>
        <BchInput
          companyName={merchant.companyName}
          destinationAddress={merchant.destinationAddress}
          markValid={this.markValid}
          markInvalid={this.markInvalid}
          updateBip70Payload={this.updateBip70Payload}
        />

        <div
          className={`merchant-proceed ${isValid ? "active" : "disabled"}`}
          onClick={() => {
            this.submitPayload();
          }}
        >
          Request
        </div>
      </React.Fragment>
    );
  }
}
