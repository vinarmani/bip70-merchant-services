import * as React from "react";

export interface KeypadProps {
  updateInput: Function;
  deleteInput: Function;
  handleDecimal: Function;
}

interface KeypadState {}

export class Keypad extends React.Component<KeypadProps, KeypadState> {
  state: KeypadState = {};

  componentDidMount = () => {};

  render(): JSX.Element {
    const { updateInput, deleteInput, handleDecimal } = this.props;

    return (
      <div className="bch-input">
        <p onClick={() => updateInput(1)}> 1 </p>
        <p onClick={() => updateInput(2)}> 2 </p>
        <p onClick={() => updateInput(3)}> 3 </p>
        <p onClick={() => updateInput(4)}> 4 </p>
        <p onClick={() => updateInput(5)}> 5 </p>
        <p onClick={() => updateInput(6)}> 6 </p>
        <p onClick={() => updateInput(7)}> 7 </p>
        <p onClick={() => updateInput(8)}> 8 </p>
        <p onClick={() => updateInput(9)}> 9 </p>
        <p onClick={() => handleDecimal()}> . </p>
        <p onClick={() => updateInput(0)}> 0 </p>
        <p onClick={() => deleteInput()}> del </p>
      </div>
    );
  }
}
