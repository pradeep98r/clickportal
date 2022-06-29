import React, { useEffect, useState } from "react";
import { getMandiDetails } from "../../services/billCreationService";
function BillView() {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.clickId;
  const clientId = loginData.authKeys.clientId;
  const clientSecret = loginData.authKeys.clientSecret;
  const [mandiData, setMandiData] = useState([]);
  const singleBillData = JSON.parse(localStorage.getItem("selectedBillData"));
  console.log(singleBillData);
  useEffect(() => {
    getBusinessDetails();
    getBuyBillsById();
  }, []);
  const getBusinessDetails = () => {
    getMandiDetails(clickId, clientId, clientSecret)
      .then((response) => {
        setMandiData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getBuyBillsById = () => {};
  return (
    <div className="main_div_padding">
      <div className="container-fluid px-0">
        <div className="row">
          <div className="col-lg-7 col_left">
            <div className="bill_view_card">
              <div className="bill_view_header">
                <div className="row bill_view_top_header">
                  <div className="col-lg-3">
                    <p className="small_text">Proprietor</p>
                    <p className="medium_text">
                      {mandiData.personalDtls?.ownerName + "kunuku"}
                    </p>
                  </div>
                  <div className="col-lg-6 text-center credit_bill">
                    Cash / Credit Bill
                  </div>
                  <div className="col-lg-3 text-end">
                    <p className="small_text">
                      {mandiData.businessDtls?.contactName}
                    </p>
                    <p className="medium_text">
                      {mandiData.businessDtls?.mobile}
                    </p>
                  </div>
                </div>
                <div className="row mandi_details_header align_items_center">
                  <div className="col-lg-2">
                    <div className="mandi_circle flex_class">
                      <p className="mandi_logo">
                        {mandiData.businessDtls?.shortCode}
                      </p>
                    </div>
                    <div className="billid_date_bg">
                      <p className="small_text text-center">
                        Bill ID : {singleBillData.billId}
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-8 text-center p-0">
                    <h2 className="large_text">
                      {mandiData.businessDtls?.businessName}
                    </h2>
                    <p className="medium_text">
                      {mandiData.businessDtls?.businessType}
                    </p>
                    <p className="small_text">
                      {mandiData.businessDtls?.businessAddress?.addressLine +
                        "," +
                        mandiData.businessDtls?.businessAddress?.dist +
                        ",Pincode-" +
                        mandiData.businessDtls?.businessAddress?.pincode +
                        "," +
                        mandiData.businessDtls?.businessAddress?.state}
                    </p>
                  </div>
                  <div className="col-lg-2 text-center">
                    <div className="mandi_circle shop_no">
                      <span className="small_text">Shop No</span>
                      <p className="mandi_logo shop_number">
                        {mandiData.businessDtls?.shopNum}
                      </p>
                    </div>
                    <div className="billid_date_bg">
                      <p className="small_text text-center">
                        {singleBillData.billDate}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bill_crop_details">
                <div className="row partner_info_padding">
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">
                        Bill To {singleBillData.partyType}:{" "}
                      </p>
                      <h6 className="small_text">
                        {singleBillData.farmerName}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">Address: </p>
                      <h6 className="small_text">
                        {singleBillData.farmerAddress}
                      </h6>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="partner_info">
                      <p className="small_text">Transporter :</p>
                      <h6 className="small_text">
                        {singleBillData.transporterName}
                      </h6>
                    </div>
                  </div>
                </div>
                {/* table */}
                <table class="table table-bordered table-responsive">
                  <thead>
                    <tr>
                      <th>S.no</th>
                      <th>Particulars</th>
                      <th>Qty. </th>
                      <th>Rate (₹)</th>
                      <th>Total (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleBillData.lineItems.map((item, key) => {
                      return (
                        <tr key={item}>
                          <td>{key + 1}</td>
                          <td>
                            <p className="flex_class crop_name">
                              <img
                                src={item.imageUrl}
                                className="crop_image_bill"
                              />
                              <p> {item.cropName}</p>
                            </p>
                          </td>
                          <td>
                            {" "}
                            <p>{item.qtyUnit + ":" + item.qty}</p>
                            <p className="red_text">
                              Wastage:
                              {item.wastage == null ? "0" : item.wastage}
                            </p>
                          </td>
                          <td>{item.rate}</td>
                          <td>{item.total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-lg-5"></div>
        </div>
      </div>
    </div>
  );
}
export default BillView;
