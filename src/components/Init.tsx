import * as React from "react"

import { Link } from "react-router-dom";
import cryptoSVG from "../../src/img/crypto.svg"


export interface InitProps {
}

export class Init extends React.Component<InitProps, any> {
  state = {
    isValid: false
  }

  markValid() {
    this.setState({ isValid: true })
  }

  markInvalid() {
    this.setState({ isValid: false })
  }

  handleOnChange = (e: any) => {
    const value: string = e.target.value
    if (value.length >= 4) {
      this.markValid()
    } else {
      this.markInvalid()
    }
  }

  validateID = (id: string) => {
    // make request to bitcoin.com to validate merchant id/pin
  }

  render(): JSX.Element {
    const { isValid } = this.state
    return (
      <div className="wrapper">
        <h1 className="merchant-header">Welcome to your Bitcoin Cash Register</h1>
        <img src={cryptoSVG}  style={{maxHeight: '30vh'}}/>
        <div className="merchant-input">
          <label htmlFor="merchant">Enter merchant ID</label>
          <input
          name="merchant"
          type="text"
          onChange={e => {
            this.handleOnChange(e);
            }}
          />
        </div>

        <div className={`merchant-proceed ${isValid ? 'active' : 'disabled'}`}>
          <Link to="/invoice"> Proceed </Link>
        </div>
      </div>
    );
  }
}
