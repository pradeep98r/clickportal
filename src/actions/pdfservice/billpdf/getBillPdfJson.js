import moment from "moment";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
} from "../../../components/getCurrencyNumber";
import getIndividualTotalUnits from "../functions/getIndividualUnits";
import getPdfHeaderData from "../headerJsonData";
import getPdfThemeInfo from "../pdfThemeInfo";
import getPdColors from "../pdfThemeInfo";

/*
   {
      "billData": getCropList(billViewViewModel),
      "groupSettings": generateGroupSettingsList(billViewViewModel),
      "totalQty": individualTotalUnits,
      "finalLedgerBalance": billViewViewModel.finalLedgerBalance.toPrice(),
      "billType": billTypeToString[billViewViewModel.billType] ?? "",
      "totalBillAmount": billViewViewModel.totalBillAmount.toPrice(),
      "outStandingBal": billViewViewModel.outStandingAmount.toPrice(),
    }

    headerData.addAll({
    "billId": _id,
    "billDate": getDateMonthYear(viewModel.groupBillList.first.billDate,
            isLocale: true)
        .toUpperCase(),
  });     
    
*/

const getCropUnit = (unit) => {
  var unitType = "";
  switch (unit.toLowerCase()) {
    case "crates":
      unitType = "C";
      break;
    case "boxes":
      unitType = "BX";
      break;
    case "bags":
      unitType = "BG";
      break;
    case "sacs":
      unitType = "S";
      break;
    case "loads":
      unitType = "LDS";
      break;
    case "pieces":
      unitType = "PCS";
      break;
    case "kgs":
      unitType = "KGS";
      break;
    default:
      unitType = "KGS";
      break;
  }
  return unitType;
};

var jsonData = {
  buyerName: "vidya - sagar",
  userType: "FARMER",
  address: "adfadfadd",
  transporter: "",
  primaryColor: "rgba(175.0,161.0,23.0,1.0)",
  lightColor: "rgba(175.0,173.0,158.0,1.0)",
  darkerColor: "rgba(122.49999999999999,112.69999999999999,16.1,1.0)",
  headerData: {
    propriterName: "sagar",
    phoneNo: "1313413431",
    mandiName: "SAGAR",
    title: "SAGAR",
    address: "ADFFSDFSD, SRIKAKULAM, PINCODE-532445, ANDHRA PRADESH",
    heading: "CASH BILL",
    shopNo: "SAAGA",
    shortCode: "SAGA",
    logoUrl:
      "https://dev-onoark-api.s3.ap-south-1.amazonaws.com/logo/image_cropper_1667908397057.jpg",
    isBillView: true,
    isPaymentReceipt: false,
    languageId: "te",
    userLabel: "PROPRIETOR",
    billId: "48",
    billDate: "01-JAN-22",
  },
  billData: [
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Aloe+Vera.png",
      cropName: "ALOE VERA",
      lotId: "",
      qty: "22.0 C  | 222.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "220.0",
      rate: "22.00",
      total: "4,840.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Aloe+Vera.png",
      cropName: "ALOE VERA",
      lotId: "",
      qty: "22.0 C  | 222.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "220.0",
      rate: "22.00",
      total: "4,840.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Aloe+Vera.png",
      cropName: "ALOE VERA",
      lotId: "",
      qty: "22.0 C  | 22.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "20.0",
      rate: "222.00",
      total: "4,440.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Aloe+Vera.png",
      cropName: "ALOE VERA",
      lotId: "",
      qty: "22.0 C ",
      wastage: " - 2.0 C",
      qtyTotal: "20.0",
      rate: "22.00",
      total: "440.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Aloe+Vera.png",
      cropName: "ALOE VERA",
      lotId: "",
      qty: "22.0 C  | 2.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "0.0",
      rate: "222.00",
      total: "0.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Ash+Gourd.png",
      cropName: "ASH GOURD",
      lotId: "",
      qty: "22.0 BX  | 222.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "220.0",
      rate: "22.00",
      total: "4,840.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Ash+Gourd.png",
      cropName: "ASH GOURD",
      lotId: "",
      qty: "22.0 BX  | 22.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "20.0",
      rate: "22.00",
      total: "440.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Ash+Gourd.png",
      cropName: "ASH GOURD",
      lotId: "",
      qty: "22.0 BX  | 22.0 KGS",
      wastage: " - 2.0 KGS",
      qtyTotal: "20.0",
      rate: "22.00",
      total: "440.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Ash+Gourd.png",
      cropName: "ASH GOURD",
      lotId: "",
      qty: "22.0 BX ",
      wastage: " - 2.0 BX",
      qtyTotal: "20.0",
      rate: "22.00",
      total: "440.00",
      individualBags: "",
    },
    {
      imageUrl: "https://agfin-crop-images.s3.amazonaws.com/png/Ash+Gourd.png",
      cropName: "ASH GOURD",
      lotId: "",
      qty: "8.0 BX ",
      wastage: " - 2.0 BX",
      qtyTotal: "6.0",
      rate: "32.00",
      total: "192.00",
      individualBags: "",
    },
  ],
  groupSettings: [
    { settingType: "commission", value: "- 418.24" },
    { settingType: "return Commission", value: "+ 418.24" },
    { settingType: "transportation", value: "- 412.0" },
    { settingType: "labour", value: "- 4532.0" },
    { settingType: "rent", value: "- 412.0" },
    { settingType: "mandi Fee", value: "- 418.24" },
    { settingType: "govt Fee", value: "- 2.0" },
    { settingType: "SUBTOTAL", value: "₹15,135.76" },
  ],
  totalQty: "92.0 BX | 108.0 C | 720.0 KGS ",
  grossTotal: "₹20,912.00",
  finalLedgerBalance: "₹1,60,172.56",
  onoCommission: "ONO-01012022-CLICK-15135.76",
  billType: "BUYBILL",
  totalBillAmount: "₹15,135.76",
  outStandingBal: "₹1,45,036.80",
  isDuplicate: false,
  isPaid: false,
  signatureUrl:
    "https://dev-onoark-api.s3.ap-south-1.amazonaws.com/signature/328image2022-12-13%2015%3A39%3A50.068996.png",
  mandiName: "VIDYA MANDI",
  cashValue: "",
};

function getQuantityData(qty, qtyUnit, weight) {
  return `${
    (qty === 0 ? "" : getCurrencyNumberWithOneDigit(qty)) +
    (qtyUnit.toLowerCase() === "loads" ||
    qtyUnit.toLowerCase() === "pieces" ||
    qtyUnit.toLowerCase() === "kgs"
      ? ""
      : getCropUnit(qtyUnit))
  } ${
    qty === 0 || qty === null
      ? ""
      : weight === 0 || weight === null
      ? ""
      : " | "
  }
  ${
    getCurrencyNumberWithOneDigit(weight) +
    (qtyUnit.toLowerCase() === "loads" ||
    qtyUnit.toLowerCase() === "pieces" ||
    qtyUnit.toLowerCase() === "kgs"
      ? getCropUnit(qtyUnit)
      : weight === 0 || weight === null
      ? ""
      : "KGS")
  }
    `;
}
function getWastage(wastage, qtyUnit, rateType) {
  return `${
    wastage !== "0"
      ? wastage !== null
        ? " - " +
          getCurrencyNumberWithOneDigit(wastage) +
          (qtyUnit.toLowerCase() === "pieces"
            ? getCropUnit(qtyUnit)
            : qtyUnit.toLowerCase() === "loads"
            ? ""
            : rateType === "RATE_PER_KG"
            ? "KGS"
            : getCropUnit(qtyUnit))
        : ""
      : ""
  }`;
}
const totalBagsValue = (bags) => {
  var totalValue = 0;
  bags.map((item) => {
    totalValue += item.weight - item.wastage;
  });
  return totalValue;
};

function getIndividualBags(bagsList) {
  return bagsList !== null
    ? bagsList.map((i) => {
        return `${i.weight ? i.weight + " " : ""} ${i.wastage ? " - " : ""} ${
          i.wastage ? i.wastage : ""
        } ${totalBagsValue(bagsList)}`;
      })
    : "";
}
const getFinalLedgerBalance = (billData, billSettingsData, isFarmer) => {
  var includeComm = false;
  var includeRetComm = false;
  var isShown = false;
  var addRetComm = false;
  var isNotTrader =
    billData.partyType.toUpperCase() === "FARMER" ||
    billData.partyType.toUpperCase() === "SELLER";
  billSettingsData.forEach((value) => {
    if (value.settingName === "COMMISSION") {
      includeComm = value.includeInLedger === 1 ? true : false;
      isShown = value.isShown === 1 ? true : false;
    }
    if (value.settingName === "RETURN_COMMISSION") {
      addRetComm = value.addToGt === 1 ? false : true;
      includeRetComm = value.includeInLedger === 1 ? true : false;
    }
  });
  var t = Number(0);
  if (isFarmer) {
    t = Number(
      billData.transportation +
        billData.labourCharges +
        billData.rent +
        billData.mandiFee +
        billData.govtLevies +
        billData.misc +
        billData.advance
    );
  } else {
    t = Number(
      billData.transportation +
        billData.labourCharges +
        billData.rent +
        billData.mandiFee +
        billData.govtLevies +
        billData.otherFee
    );
  }
  var finalValue = 0;
  if (isNotTrader) {
    finalValue = billData.grossTotal - t;
  } else {
    finalValue = billData.grossTotal + t;
  }
  var finalVal = finalValue;
  if (isNotTrader) {
    if (includeComm) {
      if (isShown) {
        finalVal = finalVal - billData.comm;
      }
    }
  } else {
    if (includeComm) {
      if (isShown) {
        finalVal = finalVal + billData.comm;
      }
    }
  }

  if (isNotTrader) {
    if (addRetComm) {
      if (includeRetComm) {
        finalVal = finalVal - billData.rtComm;
      }
    } else {
      if (includeRetComm) {
        finalVal = finalVal + billData.rtComm;
      }
    }
  } else {
    if (addRetComm) {
      if (includeRetComm) {
        finalVal = finalVal - billData.rtComm;
      }
    } else {
      finalVal = finalVal + billData.rtComm;
    }
  }
  for (var i = 0; i < billData.customFields.length; i++) {
    if (billData.customFields[i].field !== "") {
      if (billData.customFields[i].less) {
        finalVal = finalVal - billData.customFields[i].fee;
      } else {
        finalVal = finalVal + billData.customFields[i].fee;
      }
    }
  }
  if (isNotTrader) {
    return (
      (Number(finalVal) + billData.outStBal).toFixed(2) -
      Number(billData.cashPaid)
    ).toFixed(2);
  } else {
    var cashRecieved = billData.cashRcvd === null ? 0 : billData.cashRcvd;
    return (
      (Number(finalVal) + billData.outStBal).toFixed(2) - cashRecieved
    ).toFixed(2);
  }
};

function getGroupSettingsList(billSettingsData, isFarmer) {
  var groupListData = [];
  var hiddenFields = [
    "COMM_INCLUDE",
    "DEFAULT_RATE_TYPE",
    "SKIP_INDIVIDUAL_EXP",
    "BILL_EDIT",
    "WASTAGE",
    "OUT_ST_BALANCE",
    "CASH_PAID",
    "CASH_RECEIVED",
  ];
  billSettingsData.forEach((settingData) => {});
  return groupListData;
}

export default function getBillPdfJson(billData, { isDuplicate = false }) {
  var colorThemeInfo = getPdfThemeInfo();
  var headerData = getPdfHeaderData({});
  headerData["billId"] = billData.billId;
  headerData["billDate"] = billData.billDate.toUpperCase();
  var isFarmer = billData.partyType === "FARMER";
  var billType = isFarmer ? "BUYBILL" : "SELLBILL";
  var billSettingsData = JSON.parse(localStorage.getItem("BillSettingData"));
  return {
    primaryColor: colorThemeInfo.primaryColor,
    lightColor: colorThemeInfo.lightColor,
    darkerColor: colorThemeInfo.darkerColor,
    isDuplicate: isDuplicate,
    headerData: headerData,
    mandiName: colorThemeInfo.mandiName.toUpperCase(),
    signatureUrl: colorThemeInfo.signatureUrl,
    buyerName: isFarmer
      ? billData.farmerName.toUpperCase()
      : billData.buyerName.toUpperCase(),
    userType: billData.partyType.toUpperCase(),
    address: isFarmer
      ? billData.farmerAddress.toUpperCase()
      : billData.buyerAddress.toUpperCase(),
    transporter: billData.transporterName,
    billType: billType,
    onoCommission: `ONO-${moment(billData.billDate).format("DDMMYYYY")}
    -CLICK-
    ${
      billData.partyType === "BUYER"
        ? billData.actualReceivable.toFixed(2)
        : billData.actualPaybles.toFixed(2)
    }`,
    isPaid: billData.paid,
    totalQty: getIndividualTotalUnits(billData.lineItems),
    grossTotal: billData.grossTotal.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }),
    billData: billData.lineItems.map((item, key) => {
      return {
        imageUrl: item.imageUrl,
        cropName: item.cropName,
        lotId: item.lotId,
        qty: getQuantityData(item.qty, item.qtyUnit, item.weight),
        wastage: getWastage(item.wastage, item.qtyUnit, item.rateType),
        qtyTotal: "",
        rate: getCurrencyNumberWithOutSymbol(item.rate),
        total: getCurrencyNumberWithOutSymbol(item.total),
        individualBags: getIndividualBags(item.bags),
      };
    }),

    finalLedgerBalance: getFinalLedgerBalance(
      billData,
      billSettingsData,
      isFarmer
    ),
    outStandingBal: billData.outStBal.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      style: "currency",
      currency: "INR",
    }),
    // totalBillAmount: billViewViewModel.totalBillAmount.toPrice(),
    groupSettings: getGroupSettingsList(billSettingsData, isFarmer),

    // [
    //   { settingType: "commission", value: "- 418.24" },
    //   { settingType: "return Commission", value: "+ 418.24" },
    //   { settingType: "transportation", value: "- 412.0" },
    //   { settingType: "labour", value: "- 4532.0" },
    //   { settingType: "rent", value: "- 412.0" },
    //   { settingType: "mandi Fee", value: "- 418.24" },
    //   { settingType: "govt Fee", value: "- 2.0" },
    //   { settingType: "SUBTOTAL", value: "₹15,135.76" },
    // ],
  };

  /*
  
   {billData?.grossTotal + allGroupsTotal === 0 ||
  billData?.grossTotal + allGroupsTotal === null
    ? " "
    : (billData?.grossTotal + allGroupsTotal).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 2,
          style: "currency",
          currency: "INR",
        }
      )}
  */
}
