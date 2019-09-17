import * as React from "react";

import { Link, Redirect } from "react-router-dom";
import store from "store";
import axios from "axios";
import { AxiosResponse } from "axios";

const cryptoSVG = require("../crypto.svg");

export interface InitProps {}

interface InitState {
  isValid: boolean;
  id: string;
  errorMsg: string;
  response: object;
}

export class Init extends React.Component<InitProps, InitState> {
  state: InitState = {
    isValid: false,
    id: "",
    errorMsg: "",
    response: {}
  };

  componentDidMount = () => {};

  markValid() {
    this.setState({ isValid: true });
  }

  markInvalid() {
    this.setState({ isValid: false });
  }

  handleOnChange = (e: any) => {
    const value: string = e.target.value;
    if (value.length >= 4) {
      this.markValid();
    } else {
      this.markInvalid();
    }

    this.setState({ id: value });
  };

  validateID = async (id: string) => {
    // mock api response with merchant id
    /*const mockResponse = {
      apiKey: "asdjfew7yoyhafsadfa",
      success: true
    }; */

    const mockResponse: AxiosResponse = await axios.get(
      `https://pay.bitcoin.com/am/${id}`,
      { headers: { Accept: "application/json" } }
    );

    if (mockResponse.status !== 200) {
      return this.setState({ errorMsg: "invalid id" });
    }

    mockResponse.data.apiKey = id;

    this.saveMerchantID(mockResponse.data);

    this.setState({
      response: mockResponse,
      errorMsg: ""
    });


  };

  saveMerchantID = (response: object) => {
    store.set("merchant", response);
  };

  render(): JSX.Element {
    const merchantInfo = store.get("merchant");
    const hasMerchantSaved = merchantInfo !== undefined;
    if (hasMerchantSaved) {
      console.log("redirecting")
      return (
        <Redirect
          push
          to={{
            pathname: "/invoice"
          }}
        />
      );
    }

    const { isValid, id, response, errorMsg } = this.state;
    return (
      <div className="wrapper">
        <h1 className="merchant-header">
          Welcome to your Bitcoin Cash Register
        </h1>
        <img src={cryptoSVG} style={{ maxHeight: "30vh" }} />
        <div className="merchant-input">
          <label htmlFor="merchant">Enter merchant ID</label>
          <input
            name="merchant"
            type="text"
            onChange={e => {
              this.handleOnChange(e);
            }}
          />
          {errorMsg && <div className="error"> error msg </div>}
        </div>

        <div
          className={`merchant-proceed ${isValid ? "active" : "disabled"}`}
          onClick={() => {
            this.validateID(id);
          }}
        >
          <Link to="#">Proceed</Link>
        </div>
      </div>
    );
  }
}
