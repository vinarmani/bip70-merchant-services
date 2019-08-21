import * as React from "react"

import { Link } from "react-router-dom";


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
      <div>
        <h1>enter your merchant id</h1>
        <input type="text" onChange={e => { this.handleOnChange(e) }} />
        {isValid && <Link to="/invoice"> Proceed </Link>}
      </div>
    )
  }
}
