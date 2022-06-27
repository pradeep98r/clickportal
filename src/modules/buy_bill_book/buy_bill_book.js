import React, { Component } from "react";
import "../buy_bill_book/buy_bill_book.scss";
import Button from "../../components/button";
import single_bill from "../../assets/images/bills/single_bill.svg";
import multi_bills from "../../assets/images/bills/multi_bills.svg";
import { Link } from "react-router-dom";
class BuyBillBook extends Component {
  render() {
    return (
      <div>
        <div className="main_div_padding">
          <div className="container-fluid px-0">
            <div className="card default_card text-center">
              <div className="row no_data_row">
                <div className="col-lg-6 col1">
                  <div>
                    <img src={single_bill} alt="image" className="flex_class" />
                    <p>
                      Lorem ipsum is placeholder text commonly used in the
                      graphic
                    </p>
                    <Link to="/bill_creation">
                      <Button text="Single Bill" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <img src={multi_bills} alt="image" className="flex_class" />
                    <p>
                      Lorem ipsum is placeholder text commonly used in the
                      graphic
                    </p>
                    <Button text="Multi Bill" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default BuyBillBook;
