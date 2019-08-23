import * as React from "react";

export interface DisplayProps {
  parentState: {
    floatVal: number;
    bigNumber: any;
    stringValue: string;
    currency: string;
  };
}

interface DisplayState {}

export class Display extends React.Component<DisplayProps, DisplayState> {
  state: DisplayState = {};

  componentDidMount = () => {};

  render(): JSX.Element {
    const {
      parentState: { currency, floatVal, bigNumber, stringValue }
    } = this.props;
    return (
      <div className="bch-input-display">
        <h1>{stringValue}</h1>
        {/* <p>{currency}</p> */}
      </div>
    );
  }
}
