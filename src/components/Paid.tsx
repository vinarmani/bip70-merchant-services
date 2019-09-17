import * as React from "react";
import { Link } from "react-router-dom";

export interface PaidProps {}

export class Paid extends React.Component<PaidProps, any> {
  constructor(props: PaidProps, context: any) {
    super(props, context)
    this.state = {}
  }

  render(): JSX.Element {
    return (
      <div id="paid">
        <p>
          <span className="glyphicon glyphicon-ok" />
        </p>
        <p className="cardTitle">Success!</p>
        <p className="cardText">You have fully paid the invoice.</p>
        <p>
          <div className="merchant-proceed active">
          <Link to="/">All Done</Link>
        </div>
        </p>
      </div>
    )
  }
}
