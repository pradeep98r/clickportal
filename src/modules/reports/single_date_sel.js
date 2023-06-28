import { useEffect, useState } from "react";
import date_icon from "../../assets/images/date_icon.svg";
import prev_icon from "../../assets/images/prev_icon.svg";
import next_icon from "../../assets/images/next_icon.svg";
import moment from "moment";
import $ from "jquery";
import close from "../../assets/images/close.svg";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { dailySelectDate, dailySummaryData } from "../../reducers/reportsSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDailySummaryData } from "../../actions/reportsService";
const SinleDate = () => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const clickId = loginData.caId;
  const [selectedDate, setStartDate] = useState(new Date());
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const reportsData = useSelector((state) => state.reportsInfo);
  const selectedDateVal = reportsData?.dailySelectDate;
  console.log(selectedDateVal, "selectedDateVal siingledate");
  useEffect(() => {
    if (selectedDateVal != null) {
      var d = moment(selectedDateVal).format("YYYY-MM-DD");
      dispatch(dailySelectDate(d));
      getDailySummary(d);
    }
  }, []);
  const onPrevDate = () => {
    var currentDate = selectedDate;
    var yesterdayDate = currentDate.setDate(currentDate.getDate() - 1);
    setStartDate(new Date(yesterdayDate));
    getDateValue(new Date(yesterdayDate));
  };
  const onNextDate = () => {
    var currentDate = selectedDate;
    if (
      moment(selectedDate).format("YYYY-MM-DD") !==
      moment(new Date()).format("YYYY-MM-DD")
    ) {
      var yesterdayDate = currentDate.setDate(currentDate.getDate() + 1);
      setStartDate(new Date(yesterdayDate));
      getDateValue(new Date(yesterdayDate));
    }
  };
  const partnerSelectDate = moment(selectedDate).format("DD-MMM-YYYY");
  const DateModalPopup = () => {
    $("#datePopupmodalPopup").modal("show");
  };
  const closePopup = () => {
    $("#datePopupmodalPopup").modal("hide");
  };
  const getDateValue = async (dateValue) => {
    var firstDate = moment(dateValue).format("YYYY-MM-DD");
    closePopup();
    setLoading(true);
    getDailySummary(firstDate);
    dispatch(dailySelectDate(firstDate));
  };
  const dailyOnchange = (date, type) => {
    setStartDate(date);
    getDateValue(date);
  };
  const getDailySummary = (date) => {
    var d = moment(date).format("YYYY-MM-DD");
    console.log(date, d, "click");
    getDailySummaryData(d, clickId).then(
      (response) => {
        if (response.data.status.type === "SUCCESS") {
          toast.success(response.data.status.message, {
            toastId: "success1",
          });
          if (response.data.data != null) {
            dispatch(dailySummaryData(response.data.data));
          } else {
            dispatch(dailySummaryData(null));
          }
          console.log(response, "daily sum");
        }
      },
      (error) => {
        toast.error(error.response.data.status.description, {
          toastId: "error1",
        });
      }
    );
  };

  return (
    <div>
      <div className="smartboard_date">
        <span className="" onClick={onPrevDate}>
          <img src={prev_icon} alt="icon" className="mr-3" />
        </span>

        <div onClick={DateModalPopup} className="selected_date m-0">
          <div className="d-flex align-items-center">
            <span className="date_icon m-0">
              <img src={date_icon} alt="icon" className="mr-2 d-flex" />
            </span>
            <p>{partnerSelectDate}</p>
          </div>
        </div>
        <span className="" onClick={onNextDate}>
          <img src={next_icon} alt="icon" className="ml-3" />
        </span>
      </div>
      <div className="modal fade" id="datePopupmodalPopup">
        <div className="modal-dialog modal-dialog-centered date_modal_dialog samrtboard_calender">
          <div className="modal-content">
            <div className="modal-header date_modal_header smartboard_modal_header">
              <h5 className="modal-title header2_text" id="staticBackdropLabel">
                Select Date
              </h5>
              <img
                src={close}
                alt="image"
                className="close_icon"
                onClick={closePopup}
              />
            </div>
            <div className="modal-body date_modal_mody smartboard_modal_mody">
              <div className="calender_popup ">
                <div className="daily">
                  <DatePicker
                    dateFormat="dd-MMM-yy"
                    selected={selectedDate}
                    onChange={(date) => dailyOnchange(date, "daily")}
                    className="form-control"
                    placeholder="Date"
                    maxDate={new Date()}
                    inline
                    disabledKeyboardNavigation
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SinleDate;
