import * as React from "react";

import { Link } from "react-router-dom";
import BchInput from "./bch-input";

export interface InvoiceProps {
  location: object;
}

interface InvoiceState {
  id: string;
  errorMsg: string;
  merchant: {
    currency: string;
    destinationAddress: string;
    companyName: string;
  };
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
    isValid: false
  };

  componentDidMount = () => {
    const { location } = this.props;

    this.getMerchantInfo("apikey");
  };

  getMerchantInfo = async (apiKey: string) => {
    const resp = await this.mockApiCall(apiKey);
    this.setState({ merchant: resp });
  };

  mockApiCall = async (apiKey: string) => {
    return {
      currency: "USD",
      destinationAddress: "asdf",
      companyName: "Test Merchant Name"
    };
  };

  markValid = () => {
    this.setState({ isValid: true });
  };
  markInvalid = () => {
    this.setState({ isValid: false });
  };

  render(): JSX.Element {
    const {
      merchant: { companyName },
      isValid
    } = this.state;

    return (
      <div className="wrapper">
        <BchInput
          companyName={companyName}
          markValid={this.markValid}
          markInvalid={this.markInvalid}
        />

        <div
          className={`merchant-proceed ${isValid ? "active" : "disabled"}`}
          style={{ marginTop: "8rem" }}
        >
          <Link
            to={{
              pathname: "/request"
            }}
          >
            Request
          </Link>
        </div>
      </div>
    );
  }
}
