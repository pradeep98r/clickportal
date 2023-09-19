import React, { Fragment, useEffect, useState } from "react";
import {
  getInventory,
  getInventoryLedgers,
  getInventoryLedgersAll,
  getInventorySummary,
  getInventorySummaryAll,
  getParticularTransporter,
  getParticularTransporterAll,
  getTransporters,
  getTransportersAll,
} from "../../actions/transporterService";
import SearchField from "../../components/searchField";
import single_bill from "../../assets/images/bills/single_bill.svg";
import date_icon from "../../assets/images/date_icon.svg";
import {
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
  getMaskedMobileNumber,
} from "../../components/getCurrencyNumber";
import no_data_icon from "../../assets/images/NodataAvailable.svg";
import moment from "moment";
import PaymentLedger from "./paymentLedger";
import InventoryLedger from "./inventoryLedger";
import { getOutstandingBal } from "../../actions/ledgersService";
import AddRecordInventory from "./addRecordInventory";
import { useDispatch, useSelector } from "react-redux";
import addbill_icon from "../../assets/images/addbill.svg";
import {
  outstandingAmount,
  paymentSummaryInfo,
  paymentTotals,
  singleTransporterObject,
  transpoLedgersInfo,
  transporterIdVal,
  inventoryTotals,
  inventorySummaryInfo,
  outstandingBalForParty,
  inventoryUnitDetails,
  allPartnersInfo,
  singleTransporter,
  fromInv,
  outstandingAmountInv,
  transpoTabs,
  transporterMainTab,
  fromTransporter,
} from "../../reducers/transpoSlice";
import {
  formatInvLedger,
  getCropUnit,
} from "../../components/getCropUnitValue";
import { getPartnerData } from "../../actions/billCreationService";
import TransportoRecord from "./transportoRecord";
import { fromAdvanceFeature } from "../../reducers/advanceSlice";
import print from "../../assets/images/print_bill.svg";
import download_icon from "../../assets/images/dwnld.svg";
import { ToastContainer, toast } from "react-toastify";
import { Buffer } from "buffer";
import loading from "../../assets/images/loading.gif";
import { getAllAdvancesJson } from "../../actions/pdfservice/billpdf/getAllAdvancesPdfJson";
import {
  getInvAllLedgersPdf,
  getInvLedgersPdf,
  getPaymentLedgersPdf,
  getTransportoLedgersPdf,
} from "../../actions/pdfservice/reportsPdf";
import { getPaymentLedgerSummaryJson } from "../../actions/pdfservice/billpdf/getPaymentLedgerPdfJson";
import { getInvLedgerSummaryJson } from "../../actions/pdfservice/billpdf/getInventooryPdfJson";
import { allCustomTabs, beginDate } from "../../reducers/ledgerSummarySlice";
import DatePickerModel from "../smartboard/datePicker";
import { closeDate } from "../../reducers/ledgersCustomDateSlice";
const Transporters = (props) => {
  const loginData = JSON.parse(localStorage.getItem("loginResponse"));
  const dispatch = useDispatch();
  const clickId = loginData.caId;
  const transpoData = useSelector((state) => state.transpoInfo);
  const langData = localStorage.getItem("languageData");
  const langFullData = JSON.parse(langData);
  const [allData, setallData] = useState(transpoData?.transpoLedgersInfo);
  var transporter = transpoData?.transpoLedgersInfo;
  var transporterId = transpoData?.transporterIdVal;
  var outStAmt = transpoData?.outstandingAmount;
  var transData = transpoData?.singleTransporterObject;
  var fromInventoryTab = transpoData?.fromInv;
  var outstandingAmountInvData = transpoData?.outstandingAmountInv;
  const transpotoTabValue = props.transPortoTabVal;
  var date = moment(new Date()).format("YYYY-MM-DD");
  const [startDate, setStartDate] = useState(date);
  const [endDate, setEndDate] = useState(date);
  var defaultDate = moment(new Date()).format("DD-MMM-YYYY");
  const [dateDisplay, setDateDisplay] = useState(false);
  var [dateValue, setDateValue] = useState(defaultDate + " to " + defaultDate);
  const [handleDate, sethandleDate] = useState(false);
  const [tabs, setTabs] = useState(
    props.transPortoTabVal == "inventoryLedgerSummary"
      ? "inventoryledger"
      : "paymentledger"
  );
  const [allCustom, setAllCustom] = useState("all");
  const [allCustom1, setAllCustom1] = useState("all");
  const [startDate1, setStartDate1] = useState(date);
  const [endDate1, setEndDate1] = useState(date);
  var defaultDate1 = moment(new Date()).format("DD-MMM-YYYY");
  const [dateDisplay1, setDateDisplay1] = useState(false);
  var [dateValue1, setDateValue1] = useState(
    defaultDate + " to " + defaultDate
  );
  const [handleDate1, sethandleDate1] = useState(false);
  var payLedger =
    transpoData?.paymentTotals != null ? transpoData?.paymentTotals : null;
  var invLedger =
    transpoData?.inventoryTotals != null ? transpoData?.inventoryTotals : null;

  const [customDateHanlde, setCustomDateHandle] = useState(false);
  const [customDateHanlde1, setCustomDateHandle1] = useState(false);
  useEffect(() => {
    console.log(transporter, props.transPortoTabVal, "useeffect");
    if (props.transPortoTabVal == "inventoryLedgerSummary") {
      setTabs("inventoryledger");
      dispatch(transpoTabs("inventoryledger"));
      getInventoryDataAll();
      console.log("inventooryyy use");
      setAllCustom("all");
      setDateDisplay(false);
    } else {
      console.log("trans");
      getTransportersDataAll();
      setTabs("paymentledger");
      dispatch(transpoTabs("paymentledger"));
      setAllCustom("all");
      setDateDisplay(false);
    }
    dispatch(transporterMainTab(props.transPortoTabVal));
  }, [props]);

  const getTransportersData = (fromDate, toDate) => {
    console.log("respoo get transporters");
    getTransporters(clickId, fromDate, toDate).then((response) => {
      console.log(response.data.data, "respoo get transporters");
      dispatch(fromInv(false));
      dispatch(outstandingAmount(response.data.data));
      if (response.data.data.ledgers.length > 0) {
        dispatch(transporterIdVal(response.data.data.ledgers[0].partyId));
        dispatch(singleTransporterObject(response.data.data.ledgers[0]));
        setallData(response.data.data.ledgers);
        dispatch(transpoLedgersInfo(response.data.data.ledgers));
        getOutstandingPaybles(clickId, response.data.data.ledgers[0].partyId);
        paymentLedgerAll(response.data.data.ledgers[0].partyId);
        inventoryLedgerAll(response.data.data.ledgers[0].partyId);
        getInventoryRecord(clickId, response.data.data.ledgers[0].partyId);
      } else {
        dispatch(transpoLedgersInfo([]));
        setallData([]);
      }
      getPartners(clickId);
    });
  };
  const getTransportersDataAll = () => {
    getTransportersAll(clickId, startDate, endDate).then((response) => {
      console.log(response.data.data, "respoo get transporters");
      dispatch(fromInv(false));
      dispatch(outstandingAmount(response.data.data));
      if (response.data.data.ledgers.length > 0) {
        dispatch(transporterIdVal(response.data.data.ledgers[0].partyId));
        dispatch(singleTransporterObject(response.data.data.ledgers[0]));
        setallData(response.data.data.ledgers);
        dispatch(transpoLedgersInfo(response.data.data.ledgers));
        getOutstandingPaybles(clickId, response.data.data.ledgers[0].partyId);
        paymentLedgerAll(response.data.data.ledgers[0].partyId);
        inventoryLedgerAll(response.data.data.ledgers[0].partyId);
        getInventoryRecord(clickId, response.data.data.ledgers[0].partyId);
      } else {
        dispatch(transpoLedgersInfo([]));
        setallData([]);
      }
      getPartners(clickId);
    });
  };
  const getInventoryDataAll = () => {
    console.log("inventory");
    getInventorySummary(clickId).then((response) => {
      console.log(response, "inventory");
      dispatch(outstandingAmountInv(response.data.data.totalInventory));
      dispatch(
        transporterIdVal(response.data.data.summaryInfo[0].transporterId)
      );
      dispatch(singleTransporterObject(response.data.data.summaryInfo[0]));
      setallData(response.data.data.summaryInfo);
      dispatch(transpoLedgersInfo(response.data.data.summaryInfo));
      getOutstandingPaybles(
        clickId,
        response.data.data.summaryInfo[0].transporterId
      );
      paymentLedgerAll(response.data.data.summaryInfo[0].transporterId);
      inventoryLedgerAll(response.data.data.summaryInfo[0].transporterId);
      getInventoryRecord(
        clickId,
        response.data.data.summaryInfo[0].transporterId
      );
      getPartners(clickId);
      dispatch(fromInv(true));
    });
  };
  const getInventoryData = (fromDate, toDate) => {
    console.log("inventory");
    getInventorySummaryAll(clickId, fromDate, toDate).then((response) => {
      console.log(response, "inventory");
      dispatch(outstandingAmountInv(response.data.data.totalInventory));
      if (response.data.data.summaryInfo.length > 0) {
        dispatch(
          transporterIdVal(response.data.data.summaryInfo[0].transporterId)
        );
        dispatch(singleTransporterObject(response.data.data.summaryInfo[0]));
        getOutstandingPaybles(
          clickId,
          response.data.data.summaryInfo[0].transporterId
        );
        paymentLedgerAll(response.data.data.summaryInfo[0].transporterId);
        inventoryLedgerAll(response.data.data.summaryInfo[0].transporterId);
        getInventoryRecord(
          clickId,
          response.data.data.summaryInfo[0].transporterId
        );
      }

      setallData(response.data.data.summaryInfo);
      dispatch(transpoLedgersInfo(response.data.data.summaryInfo));

      getPartners(clickId);
      dispatch(fromInv(true));
    });
  };
  const handleSearch = (event) => {
    let value = event.target.value.toLowerCase();
    let result = [];
    result = allData.filter((data) => {
      if (data.mobile.includes(value)) {
        return data.mobile.search(value) != -1;
      } else if (
        data?.partyName?.toLowerCase().includes(value) ||
        data?.transporterName?.toLowerCase().includes(value)
      ) {
        return (
          data?.partyName?.toLowerCase().search(value) != -1 ||
          data?.transporterName?.toLowerCase().search(value) != -1
        );
      } else if (
        data?.partyId?.toString().includes(value) ||
        data?.transporterId?.toString().includes(value)
      ) {
        return (
          data?.partyId?.toString().search(value) != -1 ||
          data?.transporterId?.toString().search(value) != -1
        );
      } else if (
        data?.partyAddress?.toLowerCase().includes(value) ||
        data?.addressLine?.toLowerCase().includes(value)
      ) {
        return (
          data?.partyAddress?.toLowerCase().search(value) != -1 ||
          data?.addressLine?.toLowerCase().search(value) != -1
        );
      } else if (data.shortName.toLowerCase().includes(value)) {
        return data.shortName.toLowerCase().search(value) != -1;
      }
    });
    dispatch(transpoLedgersInfo(result));
  };
  const links = [
    {
      id: 1,
      name: "Detailed Payment Ledger",
      to: "paymentledger",
    },
    {
      id: 2,
      name: "Detailed Inventory Ledger",
      to: "inventoryledger",
    },
  ];
  const particularTransporter = (transporterId, item) => {
    dispatch(transporterIdVal(transporterId));
    dispatch(singleTransporterObject(item));
    getOutstandingPaybles(clickId, transporterId);
    getInventoryRecord(clickId, transporterId);
    setAllCustom1("all");
    setDateDisplay1(false);
    console.log(allCustom1, tabs, transpotoTabValue);
    if (
      transpotoTabValue == "inventoryLedgerSummary" &&
      tabs == "inventoryledger"
    ) {
      if (allCustom1 == "all") {
        inventoryLedgerAll(transporterId);
        dispatch(allCustomTabs("all"));
      } else {
        inventoryLedger(transporterId, startDate1, endDate1);
      }
    }
    var transTabs = "";
    if (tabs == "inventoryledger" && transpotoTabValue == "transporterLedger") {
      setTabs("paymentledger");
      transTabs = "paymentledger";
    }
    if (tabs == "paymentledger" || transTabs == "paymentledger") {
      if (allCustom1 == "all") {
        paymentLedgerAll(transporterId);
        dispatch(allCustomTabs("all"));
      } else {
        paymentLedger(transporterId, startDate1, endDate1);
      }
      console.log(transporterId, "transporterId");
    }
  };
  const tabEvent = (type) => {
    dispatch(transpoTabs(type));
    if (type == "inventoryledger") {
      inventoryLedgerAll(transporterId);
    }
    if (type == "paymentledger") {
      paymentLedgerAll(transporterId);
    }
    setTabs(type);
  };
  //get Payment Ledger
  const paymentLedgerAll = (partyId) => {
    console.log(partyId);
    getParticularTransporter(clickId, partyId)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(paymentTotals(response.data.data));
          dispatch(paymentSummaryInfo(response.data.data.details));
        } else {
          dispatch(paymentTotals([]));
          dispatch(paymentSummaryInfo([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const paymentLedger = (partyId, fromDate, toDate) => {
    console.log(partyId);
    getParticularTransporterAll(clickId, partyId, fromDate, toDate)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(paymentTotals(response.data.data));
          dispatch(paymentSummaryInfo(response.data.data.details));
        } else {
          dispatch(paymentTotals([]));
          dispatch(paymentSummaryInfo([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // get Inventory Ledger
  const inventoryLedgerAll = (transId) => {
    getInventoryLedgers(clickId, transId)
      .then((response) => {
        if (response.data.data != null) {
          dispatch(inventoryTotals(response.data.data));
          dispatch(inventorySummaryInfo(response.data.data.details));
        } else {
          dispatch(inventoryTotals([]));
          dispatch(inventorySummaryInfo([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const inventoryLedger = (transId, fromDate, toDate) => {
    getInventoryLedgersAll(clickId, transId, fromDate, toDate)
      .then((response) => {
        console.log(response.data.data, fromDate);
        if (response.data.data != null) {
          dispatch(inventoryTotals(response.data.data));
          dispatch(inventorySummaryInfo(response.data.data.details));
        } else {
          dispatch(inventoryTotals([]));
          dispatch(inventorySummaryInfo([]));
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getPartners = (clickId) => {
    getPartnerData(clickId, "TRANSPORTER")
      .then((response) => {
        if (response.data.data != null) {
          dispatch(allPartnersInfo(response.data.data));
          dispatch(singleTransporter(response.data.data[0]));
        } else {
          dispatch(allPartnersInfo([]));
        }
      })
      .catch((error) => {});
  };
  //Get Outstanding balance
  const getOutstandingPaybles = (clickId, partyId) => {
    getOutstandingBal(clickId, partyId).then((response) => {
      dispatch(outstandingBalForParty(response.data.data));
    });
  };

  //get Inventory
  const getInventoryRecord = (clickId, transId) => {
    getInventory(clickId, transId)
      .then((response) => {
        dispatch(inventoryUnitDetails(response.data.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [recordInventoryModalStatus, setRecordInventoryModalStatus] =
    useState(false);
  const [recordInventoryModal, setRecordInventoryModal] = useState(false);
  const onClickInventoryRecord = () => {
    setRecordInventoryModalStatus(true);
    setRecordInventoryModal(true);
  };
  const [recordPayModalStatus, setRecordPayModalStatus] = useState(false);
  const [recordPayModal, setRecordPayModal] = useState(false);
  const onClickPaymentRecord = () => {
    dispatch(fromTransporter(false));
    dispatch(fromAdvanceFeature(false));
    setRecordPayModal(true);
    setRecordPayModalStatus(true);
  };
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  async function handleLedgerSummaryJson(summaryStatus) {
    setIsLoadingNew(true);
    var reportsJsonBody = getAllAdvancesJson(transpoData, fromInventoryTab);
    var pdfResponse = fromInventoryTab
      ? await getInvAllLedgersPdf(reportsJsonBody)
      : await getTransportoLedgersPdf(reportsJsonBody);
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setIsLoadingNew(false);
      window.open(blobUrl, "_blank");
    }
  }
  async function getDownloadPdf(summaryStatus) {
    setIsLoadingNew(true);
    var reportsJsonBody = getAllAdvancesJson(transpoData);
    var pdfResponse = await getTransportoLedgersPdf(reportsJsonBody);
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      console.log(pdfResponse.status, "fasl");
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      console.log(pdfResponse.status, "true");
      toast.success("Pdf Downloaded SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `TRANSPORTO_LEDGER_SUMMARY.pdf`); //or any other extension
      document.body.appendChild(link);
      setIsLoadingNew(false);
      link.click();
    }
  }
  async function handleLedgerSummaryJsonSummary(tabsVal) {
    setIsLoadingNew(true);
    console.log(transpotoTabValue, tabs, tabsVal);
    var reportsJsonBody =
      tabsVal == "inventoryledger"
        ? getInvLedgerSummaryJson(
            transpoData?.inventoryTotals,
            transpoData?.singleTransporterObject
          )
        : getPaymentLedgerSummaryJson(
            transpoData?.paymentTotals,
            transpoData?.singleTransporterObject
          );
    var pdfResponse =
      tabsVal == "inventoryledger"
        ? getInvLedgersPdf(reportsJsonBody)
        : await getPaymentLedgersPdf(reportsJsonBody);
    console.log(pdfResponse.status, "pdfResponse");
    if (pdfResponse.status !== 200) {
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      toast.success("Pdf generated SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setIsLoadingNew(false);
      window.open(blobUrl, "_blank");
    }
  }
  async function getDownloadPdfSummary(tabsVal) {
    setIsLoadingNew(true);
    var reportsJsonBody =
    tabsVal == "inventoryledger"
      ? getInvLedgerSummaryJson(
          transpoData?.inventoryTotals,
          transpoData?.singleTransporterObject
        )
      : getPaymentLedgerSummaryJson(
          transpoData?.paymentTotals,
          transpoData?.singleTransporterObject
        );
  var pdfResponse =
    tabsVal == "inventoryledger"
      ? getInvLedgersPdf(reportsJsonBody)
      : await getPaymentLedgersPdf(reportsJsonBody);
    console.log(pdfResponse, "pdfResponse");
    if (pdfResponse.status !== 200) {
      console.log(pdfResponse.status, "fasl");
      toast.error("Something went wrong", {
        toastId: "errorr2",
      });
      setIsLoadingNew(false);
      return;
    } else {
      console.log(pdfResponse.status, "true");
      toast.success("Pdf Downloaded SuccessFully", {
        toastId: "errorr2",
      });
      var bufferData = Buffer.from(pdfResponse.data);
      var blob = new Blob([bufferData], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", `PAYMENT_LEDGER_SUMMARY.pdf`); //or any other extension
      document.body.appendChild(link);
      setIsLoadingNew(false);
      link.click();
    }
  }
  const allCustomEvent = (type) => {
    dispatch(allCustomTabs(type));
    if (type == "custom") {
      console.log(type, handleDate);
      setDateDisplay(true);
    } else {
      setDateDisplay(false);
      sethandleDate(true);
    }
    console.log(handleDate, date, defaultDate);
    if (handleDate) {
      setDateValue(defaultDate + " to " + defaultDate);
      setStartDate(date);
      setEndDate(date);
    }
    if (type == "all" && transpotoTabValue == "transporterLedger") {
      getTransportersDataAll();
      sethandleDate(true);
    }
    if (type == "custom" && transpotoTabValue == "transporterLedger") {
      // dispatch(partnerTabs("ledgersummary"));
      dispatch(transporterMainTab("transporterLedger"));
    } else if (type == "all" && transpotoTabValue == "inventoryLedgerSummary") {
      // dispatch(partnerTabs("ledgersummary"));
      // setLedgerTabs("ledgersummary");
      dispatch(transporterMainTab("inventoryLedgerSummary"));
      getInventoryDataAll();
    } else if (
      type == "custom" &&
      transpotoTabValue == "inventoryLedgerSummary"
    ) {
      // dispatch(partnerTabs("ledgersummary"));
      // setLedgerTabs("ledgersummary");
      dispatch(transporterMainTab("inventoryLedgerSummary"));
      getInventoryData(startDate, endDate);
    }
    if (
      type == "custom" &&
      transpotoTabValue == "transporterLedger" &&
      customDateHanlde
    ) {
      setCustomDateHandle(false);
      getTransportersData(startDate, endDate);
      console.log("custom", customDateHanlde);
    } else if (type == "custom") {
      getTransportersData(startDate, endDate);
    }
    setAllCustom(type);
  };
  const callbackFunction = (startDate, endDate, dateTab) => {
    dispatch(beginDate(startDate));
    dispatch(closeDate(endDate));
    var fromDate = moment(startDate).format("YYYY-MM-DD");
    var toDate = moment(endDate).format("YYYY-MM-DD");
    dateValue = fromDate;
    if (dateTab === "Daily") {
      setDateValue(moment(fromDate).format("DD-MMM-YYYY"));
    } else if (dateTab === "Weekly") {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    } else if (dateTab === "Monthly") {
      setDateValue(moment(fromDate).format("MMM-YYYY"));
    } else if (dateTab === "Yearly") {
      setDateValue(moment(fromDate).format("YYYY"));
    } else {
      setDateValue(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    }
    if (allCustom == "custom" && transpotoTabValue == "transporterLedger") {
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      date = fromDate;
      setStartDate(fromDate);
      setEndDate(toDate);
      getTransportersData(fromDate, toDate);
      console.log(fromDate, toDate, date);
    } else if (
      allCustom == "custom" &&
      transpotoTabValue == "inventoryLedgerSummary"
    ) {
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      date = fromDate;
      setStartDate(fromDate);
      setEndDate(toDate);
      getInventoryData(fromDate, toDate);
    } else {
      var fromDate = moment(startDate).format("YYYY-MM-DD");
      var toDate = moment(endDate).format("YYYY-MM-DD");
      setStartDate(date);
      setEndDate(date);
      sethandleDate(true);
      // detailedLedgerByDate(clickId, partyId, fromDate, toDate);
    }
  };
  const [dateCustom, setdateCustom] = useState(false);
  const [showDatepickerModal, setShowDatepickerModal] = useState(false);
  const [showDatepickerModal1, setShowDatepickerModal1] = useState(false);

  const [showDatepickerModal2, setShowDatepickerModal2] = useState(false);
  const [showDatepickerModal3, setShowDatepickerModal3] = useState(false);

  const tabsData = [
    {
      id: 1,
      name: "All",
      to: "all",
    },
    {
      id: 2,
      name: "Custom",
      to: "custom",
    },
  ];
  const onclickDate = () => {
    setShowDatepickerModal1(true);
    setShowDatepickerModal(true);
  };
  const onclickDate1 = () => {
    setShowDatepickerModal2(true);
    setShowDatepickerModal3(true);
  };
  const allCustomEvent1 = (type) => {
    console.log("inner", type, tabs);
    // dispatch(allCustomTabs(type));
    if (type == "custom") {
      console.log(type, handleDate);
      setDateDisplay1(true);
    } else {
      setDateDisplay1(false);
      sethandleDate1(true);
    }
    console.log(handleDate1, date, defaultDate);
    if (handleDate1) {
      setDateValue1(defaultDate + " to " + defaultDate);
      setStartDate1(date);
      setEndDate1(date);
    }
    if (type == "all" && tabs == "paymentledger") {
      paymentLedgerAll(transporterId);
      sethandleDate1(true);
    }
    if (type == "custom" && tabs == "paymentledger") {
      // dispatch(partnerTabs("ledgersummary"));
      setTabs("paymentledger");
    } else if (type == "all" && tabs == "inventoryledger") {
      // dispatch(partnerTabs("ledgersummary"));
      // setLedgerTabs("ledgersummary");
      setTabs("inventoryledger");
      inventoryLedgerAll(transporterId);
    } else if (type == "custom" && tabs == "inventoryledger") {
      // dispatch(partnerTabs("ledgersummary"));
      // setLedgerTabs("ledgersummary");
      setTabs("inventoryledger");
      inventoryLedger(transporterId, startDate1, endDate1);
      console.log("inner", type, tabs);
    }
    if (type == "custom" && tabs == "paymentledger" && customDateHanlde1) {
      setCustomDateHandle1(false);
      paymentLedger(transporterId, startDate1, endDate1);
      console.log("custom", customDateHanlde);
    } else if (type == "custom") {
      paymentLedger(transporterId, startDate1, endDate1);
    }
    setAllCustom1(type);
  };
  const callbackFunction1 = (startDate1, endDate1, dateTab) => {
    dispatch(beginDate(startDate1));
    dispatch(closeDate(endDate1));
    var fromDate = moment(startDate1).format("YYYY-MM-DD");
    var toDate = moment(endDate1).format("YYYY-MM-DD");
    dateValue1 = fromDate;
    if (dateTab === "Daily") {
      setDateValue1(moment(fromDate).format("DD-MMM-YYYY"));
    } else if (dateTab === "Weekly") {
      setDateValue1(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    } else if (dateTab === "Monthly") {
      setDateValue1(moment(fromDate).format("MMM-YYYY"));
    } else if (dateTab === "Yearly") {
      setDateValue1(moment(fromDate).format("YYYY"));
    } else {
      setDateValue1(
        moment(fromDate).format("DD-MMM-YYYY") +
          " to " +
          moment(toDate).format("DD-MMM-YYYY")
      );
    }
    if (allCustom1 == "custom" && tabs == "paymentledger") {
      var fromDate = moment(startDate1).format("YYYY-MM-DD");
      var toDate = moment(endDate1).format("YYYY-MM-DD");
      date = fromDate;
      setStartDate1(fromDate);
      setEndDate1(toDate);
      paymentLedger(transporterId, startDate1, endDate1);
      console.log(fromDate, toDate, date);
    } else if (allCustom1 == "custom" && tabs == "inventoryledger") {
      var fromDate = moment(startDate1).format("YYYY-MM-DD");
      var toDate = moment(endDate1).format("YYYY-MM-DD");
      date = fromDate;
      setStartDate1(fromDate);
      setEndDate1(toDate);
      inventoryLedger(transporterId, startDate1, endDate1);
    } else {
      var fromDate = moment(startDate1).format("YYYY-MM-DD");
      var toDate = moment(endDate1).format("YYYY-MM-DD");
      setStartDate1(date);
      setEndDate1(date);
      sethandleDate1(true);
      // detailedLedgerByDate(clickId, partyId, fromDate, toDate);
    }
  };
  console.log(allData, "allData");
  return (
    <div className="">
      <div className="row">
        <div className="col-lg-5 pl-0">
          <div className="d-flex align-items-center">
            <ul className="nav nav-tabs mt-0 mb-2" id="myTab" role="tablist">
              {tabsData.map((tab) => {
                return (
                  <li key={tab.id} className="nav-item ">
                    <a
                      className={
                        "nav-link" + (allCustom == tab.to ? " active" : "")
                      }
                      href={"#" + tab.name}
                      role="tab"
                      aria-controls="home"
                      data-bs-toggle="tab"
                      onClick={() => allCustomEvent(tab.to)}
                    >
                      {tab.name}
                    </a>
                  </li>
                );
              })}
            </ul>
            <div>
              <p className={dateDisplay ? "" : "padding_all"}></p>
              <div className="mb-2">
                <div
                  style={{ display: dateDisplay ? "flex" : "none" }}
                  className="dateRangePicker justify-content-center"
                >
                  <button onClick={onclickDate} className="color_blue">
                    <div className="date_icon m-0">
                      <img
                        src={date_icon}
                        alt="icon"
                        className="mr-2 date_icon_in_custom"
                      />
                      {dateValue}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {allData.length > 0 ? (
            <div className="d-flex">
              <div id="search-field">
                <SearchField
                  placeholder="Search by Name"
                  onChange={(event) => {
                    handleSearch(event);
                  }}
                />
              </div>
              {transpotoTabValue == "transporterLedger" ? (
                <div className="print_dwnld_icons d-flex">
                  <button
                    onClick={() => {
                      getDownloadPdf(true).then();
                    }}
                  >
                    <img src={download_icon} alt="img" />
                  </button>
                  <button
                    onClick={() => {
                      handleLedgerSummaryJson(true).then();
                    }}
                  >
                    <img src={print} alt="img" />
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )}
          {transporter.length > 0 ? (
            <div>
              <div className="row theadr-tag p-0">
                <th className="col-lg-1">#</th>
                <th className="col-lg-2">Date</th>
                <th class="col-lg-5">Transporter Name</th>
                {fromInventoryTab ? (
                  <th class="col-lg-4">Total Balance</th>
                ) : (
                  <th class="col-lg-4">To Be Paid(&#8377;)</th>
                )}
              </div>
              <div
                className="table-scroll ledger-table transporto_ledger_scroll ledger_table_col"
                id="scroll_style"
              >
                <div>
                  {transporter.map((item, index) => {
                    return (
                      <Fragment>
                        <button
                          onClick={() =>
                            particularTransporter(
                              fromInventoryTab
                                ? item.transporterId
                                : item.partyId,
                              item
                            )
                          }
                          className={
                            fromInventoryTab
                              ? transporterId == item.transporterId
                                ? "tabRowSelected"
                                : "tr-tags"
                              : transporterId == item.partyId
                              ? "tabRowSelected"
                              : "tr-tags"
                          }
                        >
                          <div className="row text-left align-items-center">
                            <td className="col-lg-1">{index + 1}</td>
                            <td className="col-lg-2" key={item.date}>
                              <p className="date_ledger_val">
                                {" "}
                                {moment(item.date).format("DD-MMM-YY")}
                              </p>
                            </td>
                            <td
                              className="col-lg-5 text-left"
                              key={item.partyName}
                            >
                              <div className="d-flex">
                                <div className="c-img">
                                  {item.profilePic ? (
                                    <img
                                      className="profile-img"
                                      src={item.profilePic}
                                      alt="pref-img"
                                    />
                                  ) : (
                                    <img
                                      className="profile-img"
                                      src={single_bill}
                                      alt="img"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="namedtl-tag text-left">
                                    {fromInventoryTab
                                      ? item.transporterName
                                      : item.partyName}
                                  </p>
                                  <div className="d-flex align-items-center">
                                    <p className="mobilee-tag">
                                      {fromInventoryTab
                                        ? item.transporterId
                                        : item.partyId}
                                      &nbsp;
                                    </p>
                                    <p className="mobilee-tag desk_responsive">
                                      {" | " +
                                        getMaskedMobileNumber(item.mobile)}
                                    </p>
                                  </div>
                                  <p className="mobilee-tag mobile_responsive">
                                    {getMaskedMobileNumber(item.mobile)}
                                  </p>
                                  <p className="address-tag">
                                    {fromInventoryTab
                                      ? item.addressLine
                                      : item.partyAddress
                                      ? item.partyAddress
                                      : ""}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="col-lg-4" key={item.tobePaidRcvd}>
                              {fromInventoryTab ? (
                                <p className="color_black coloring">
                                  {formatInvLedger(
                                    item?.inventory ? item.inventory : []
                                  )}
                                  {/* {item.inventory?.length > 0 &&
                                      item.inventory?.map((itemVal, index) => {
                                        return itemVal.qty
                                          ? itemVal.qty.toFixed(1) +
                                              " " +
                                              getCropUnit(
                                                itemVal.unit,
                                                itemVal.qty
                                              )
                                          : "";
                                      })} */}
                                </p>
                              ) : (
                                <p className="color_red coloring">
                                  {item.tobePaidRcvd
                                    ? getCurrencyNumberWithOutSymbol(
                                        item.tobePaidRcvd
                                      )
                                    : 0}
                                </p>
                              )}
                            </td>
                          </div>
                        </button>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
              <div className="outstanding-pay ">
                {fromInventoryTab ? (
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="pat-tag"> Total Inventory Balance : </p>
                    <p className="color_black coloring">
                      {formatInvLedger(
                        outstandingAmountInvData ? outstandingAmountInvData : []
                      )}
                      {/* {outstandingAmountInvData.length > 0 &&
                          outstandingAmountInvData.map((itemVal, index) => {
                            return itemVal.qty
                              ? itemVal.qty.toFixed(1) +
                                  " " +
                                  getCropUnit(itemVal.unit, itemVal.qty)
                              : "";
                          })} */}
                    </p>
                  </div>
                ) : (
                  <p className="valu-tag">
                    <div className="d-flex align-items-center justify-content-between">
                      <p className="pat-tag">Outstanding Payables:</p>
                      <p className="paid-coloring">
                        {outStAmt?.totalOutStgAmt
                          ? getCurrencyNumberWithSymbol(
                              outStAmt?.totalOutStgAmt
                            )
                          : 0}
                      </p>
                    </div>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="table-scroll nodata_scroll">
              <div className="row partner_no_data_widget_rows">
                <div className="col-lg-5">
                  <div className="partner_no_data_widget">
                    <div className="text-center">
                      <img
                        src={no_data_icon}
                        alt="icon"
                        className="d-flex mx-auto justify-content-center"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {allData.length > 0 ? (
          <div className="col-lg-7 p-0">
            <div className="d-flex align-items-center">
              <ul className="nav nav-tabs mt-0 mb-2" id="myTab" role="tablist">
                {tabsData.map((tab) => {
                  return (
                    <li key={tab.id} className="nav-item ">
                      <a
                        className={
                          "nav-link" + (allCustom1 == tab.to ? " active" : "")
                        }
                        href={"#" + tab.name}
                        role="tab"
                        aria-controls="home"
                        data-bs-toggle="tab"
                        onClick={() => allCustomEvent1(tab.to)}
                      >
                        {tab.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div>
                <p className={dateDisplay1 ? "" : "padding_all"}></p>
                <div className="mb-2">
                  <div
                    style={{ display: dateDisplay1 ? "flex" : "none" }}
                    className="dateRangePicker justify-content-center"
                  >
                    <button onClick={onclickDate1} className="color_blue">
                      <div className="date_icon m-0">
                        <img
                          src={date_icon}
                          alt="icon"
                          className="mr-2 date_icon_in_custom"
                        />
                        {dateValue1}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="card details-tag">
              <div className="card-body" id="card-details">
                <div className="row">
                  <div
                    className="col-lg-3 d-flex align-items-center pl-0"
                    id="verticalLines"
                  >
                    <div className="pl-0 d-flex" key={transData.partyId}>
                      {transData.profilePic ? (
                        <img
                          id="singles-img"
                          src={transData.profilePic}
                          alt="buy-img"
                        />
                      ) : (
                        <img id="singles-img" src={single_bill} alt="img" />
                      )}
                      <p id="card-text">
                        <p className="namedtl-tag">
                          {fromInventoryTab
                            ? transData.transporterName
                            : transData.partyName}
                        </p>
                        <div className="d-flex align-items-center">
                          <p className="mobilee-tag">
                            {fromInventoryTab
                              ? transData.transporterId
                              : transData.partyId}
                          </p>
                          <span className="px-1 desk_responsive">|</span>
                          <span className="mobilee-tag desk_responsive">
                            {getMaskedMobileNumber(transData?.mobile)}
                          </span>
                        </div>
                        <p className="mobilee-tag mobile_responsive">
                          {getMaskedMobileNumber(transData?.mobile)}
                        </p>
                      </p>
                    </div>
                  </div>
                  {tabs === "paymentledger" && payLedger != null && (
                    <>
                      <div
                        className="col-lg-3 d-flex align-items-center"
                        id="verticalLines"
                      >
                        <p className="card-text paid">
                          {langFullData.totalBusiness}{" "}
                          <p className="coloring color_black">
                            {payLedger?.totalToBePaid
                              ? getCurrencyNumberWithSymbol(
                                  payLedger.totalToBePaid
                                )
                              : 0}
                          </p>
                        </p>
                      </div>
                      <div
                        className="col-lg-3 d-flex align-items-center"
                        id="verticalLines"
                      >
                        <p className="total-paid">
                          {langFullData.totalPaid}
                          <p className="coloring color_black">
                            {payLedger.totalPaid
                              ? getCurrencyNumberWithSymbol(payLedger.totalPaid)
                              : 0}
                          </p>{" "}
                        </p>
                      </div>
                      <div className="col-lg-3 d-flex align-items-center">
                        <p className="out-standing">
                          {langFullData.outstandingPayables}
                          <p className="coloring color_black">
                            {payLedger.totalOutStandingBalance
                              ? getCurrencyNumberWithSymbol(
                                  payLedger.totalOutStandingBalance
                                )
                              : 0}
                          </p>
                        </p>
                      </div>
                    </>
                  )}
                  {tabs === "inventoryledger" && invLedger != null && (
                    <>
                      <div
                        className="col-lg-3 d-flex align-items-center"
                        id="verticalLines"
                      >
                        <p className="card-text paid">
                          Total Given{" "}
                          <p className="coloring color_black">
                            {invLedger?.totalGiven.length > 0
                              ? formatInvLedger(
                                  invLedger?.totalGiven
                                    ? invLedger.totalGiven
                                    : []
                                )
                              : 0}
                            {/* {invLedger.totalGiven
                              ? invLedger.totalGiven.map((item) => {
                                  return item.qty > 0
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0} */}
                          </p>
                        </p>
                      </div>
                      <div
                        className="col-lg-3 d-flex align-items-center"
                        id="verticalLines"
                      >
                        <p className="total-paid">
                          Total Collected
                          <p className="coloring color_black">
                            {invLedger?.totalCollected.length > 0
                              ? formatInvLedger(
                                  invLedger?.totalCollected
                                    ? invLedger?.totalCollected
                                    : []
                                )
                              : 0}
                            {/* {invLedger.totalCollected
                              ? invLedger.totalCollected.map((item) => {
                                  return item.qty > 0
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0} */}
                          </p>{" "}
                        </p>
                      </div>
                      <div className="col-lg-3 d-flex align-items-center">
                        <p className="out-standing">
                          Total Balance
                          <p className="coloring color_black">
                            {invLedger?.balance.length > 0
                              ? formatInvLedger(
                                  invLedger?.balance ? invLedger?.balance : []
                                )
                              : 0}
                            {/* {invLedger.balance
                              ? invLedger.balance.map((item) => {
                                  return item.qty
                                    ? item.qty.toFixed(1) +
                                        " " +
                                        getCropUnit(item.unit, item.qty)
                                    : "";
                                })
                              : 0} */}
                          </p>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <span id="horizontal-line-card"></span>
              <div className="d-flex justify-content-between align-items-end">
                <ul
                  className="nav nav-tabs ledger_tabs"
                  id="myTab"
                  role="tablist"
                >
                  {links.map((link) => {
                    return (
                      <li key={link.id} className="nav-item ">
                        <a
                          className={
                            "nav-link" + (tabs == link.to ? " active" : "")
                          }
                          href={"#" + link.to}
                          role="tab"
                          aria-controls="home"
                          data-bs-toggle="tab"
                          onClick={() => tabEvent(link.to)}
                        >
                          {link.name}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <div>
                  {tabs === "paymentledger" ? 
                  <div className="print_dwnld_icons d-flex">
                    <button
                    onClick={() => {
                      getDownloadPdfSummary(tabs).then();
                    }}
                    >
                      <img src={download_icon} alt="img" />
                    </button>
                    <button
                      onClick={() => {
                        handleLedgerSummaryJsonSummary(tabs).then();
                      }}
                    >
                      <img src={print} alt="img" />
                    </button>
                  </div>
                  : ''}
                </div>
                {tabs == "paymentledger" ? (
                  <button
                    className="primary_btn add_bills_btn"
                    onClick={() => {
                      onClickPaymentRecord();
                    }}
                  >
                    <img src={addbill_icon} alt="image" className="mr-2" />
                    Record Payment
                  </button>
                ) : tabs == "inventoryledger" ? (
                  <button
                    className="primary_btn add_bills_btn"
                    onClick={() => {
                      onClickInventoryRecord();
                    }}
                  >
                    <img src={addbill_icon} alt="image" className="mr-2" />
                    Record Inventory
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            {tabs == "paymentledger" ? (
              <PaymentLedger tabs={tabs} />
            ) : tabs == "inventoryledger" ? (
              <InventoryLedger tabs={tabs} />
            ) : (
              ""
            )}
          </div>
        ) : (
          <div className="row partner_no_data_widget_rows">
            <div className="col-lg-5">
              <div className="partner_no_data_widget">
                <div className="text-center">
                  <img
                    src={no_data_icon}
                    alt="icon"
                    className="d-flex mx-auto justify-content-center"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {recordInventoryModalStatus ? (
        <AddRecordInventory
          showRecordInventoryModal={recordInventoryModal}
          closeRecordInventoryModal={() => setRecordInventoryModal(false)}
          tabs={tabs}
          transporterMaintab={transpotoTabValue}
          type={"TRANS"}
        />
      ) : (
        ""
      )}
      {recordPayModalStatus ? (
        <TransportoRecord
          showRecordPayModal={recordPayModal}
          closeRecordPayModal={() => setRecordPayModal(false)}
          tabs={tabs}
          type={"TRANS"}
        />
      ) : (
        ""
      )}
      <ToastContainer />
      {isLoadingNew ? (
        <div className="loading_styles loading_styles_led">
          <img src={loading} alt="my-gif" className="gif_img" />
        </div>
      ) : (
        ""
      )}
      {showDatepickerModal1 ? (
        <DatePickerModel
          show={showDatepickerModal}
          close={() => setShowDatepickerModal(false)}
          parentCallback={callbackFunction}
          // ledgerTabs={ledgerTabs}
          dateCustom={dateCustom}
        />
      ) : (
        <p></p>
      )}
      {showDatepickerModal3 ? (
        <DatePickerModel
          show={showDatepickerModal2}
          close={() => setShowDatepickerModal2(false)}
          parentCallback={callbackFunction1}
          // ledgerTabs={ledgerTabs}
          dateCustom={dateCustom}
        />
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default Transporters;
