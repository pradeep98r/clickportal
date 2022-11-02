import { Modal } from "react-bootstrap";
const DatePickerModel = (props) => {
    <div className="modal fade" id="datePopupmodalPopup">
    <div className="modal-dialog modal-dialog-centered date_modal_dialog samrtboard_calender">
      <div className="modal-content">
        <div className="modal-header date_modal_header smartboard_modal_header">
          <h5 className="modal-title header2_text" id="staticBackdropLabel">
            Select{" "}
            {tabType == "Daily"
              ? "Date"
              : tabType == "Weekly"
              ? "Week"
              : tabType == "Monthly"
              ? "Month"
              : "Year"}
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
            {(() => {
              if (tabType == "Daily") {
                return (
                  <div className="daily">
                    <DatePicker
                      dateFormat="yyyy-MM-dd"
                      selected={selectedDate}
                      onChange={(date) => setStartDate(date)}
                      className="form-control"
                      placeholder="Date"
                      maxDate={new Date()}
                      inline
                    />
                  </div>
                );
              } else if (tabType == "Weekly") {
                return (
                  <div className="week_cal">
                    <div className="week-picker"></div>
                  </div>
                );
              } else if (tabType == "Monthly") {
                return (
                  <div className="weekly">
                    <DatePicker
                      dateFormat="MM/yyyy"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      selected={selectedMonthDate}
                      onChange={(date) => setSelectedMonthDate(date)}
                      className="form-control"
                      placeholder="Date"
                      maxDate={new Date()}
                      showFourColumnMonthYearPicker
                      inline
                    />
                  </div>
                );
              } else if (tabType == "Yearly") {
                return (
                  <div className="yearly">
                    <DatePicker
                      selected={selectedYearDate}
                      onChange={(date) => setSelectedyearDate(date)}
                      showYearPicker
                      dateFormat="yyyy"
                      className="form-control"
                      maxDate={new Date()}
                      showFourColumnMonthYearPicker
                      inline
                    />
                  </div>
                );
              }
            })()}
          </div>
        </div>
        <div className="modal-footer p-0">
          <button
            type="button"
            className="primary_btn cont_btn w-100 m-0"
            onClick={() =>
              getDateValue(
                tabType == "Daily"
                  ? selectedDate
                  : tabType == "Yearly"
                  ? selectedYearDate
                  : selectedMonthDate
              )
            }
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
}
export default DatePickerModel;
