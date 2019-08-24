import * as React from "react";

const bch = "../src/img/bch.png";

export interface TokenSelectionProps {
  token: {
    name: string;
    ticker: string;
    tokenID: string;
    decimal_count: number;
    imagePath: string;
  };
  active?: boolean;
  addSelection: Function;
}

interface TokenSelectionState {
  active: boolean;
}

export class TokenSelection extends React.Component<
  TokenSelectionProps,
  TokenSelectionState
> {
  state: TokenSelectionState = {
    active: false
  };

  componentDidMount = () => {};

  render(): JSX.Element {
    const { token, addSelection, active } = this.props;

    return (
      <div
        className={`token ${active ? "selected" : ""}`}
        onClick={() => {
          addSelection(token);
        }}
      >
        <div className="token-image">
          <img
            title={`${token.name} | ${token.ticker}`}
            alt={`${token.name} | ${token.ticker}`}
            src={token.imagePath}
          />
        </div>
        <div className="token-description">
          <h4>{token.ticker.toUpperCase()}</h4>
        </div>
      </div>
    );
  }
}
