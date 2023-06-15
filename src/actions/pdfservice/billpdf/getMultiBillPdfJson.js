import moment from "moment";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getPdfHeaderData from "../headerJsonData";
import getPdfThemeInfo from "../pdfThemeInfo";

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

function getQuantityData(qty, qtyUnit, weight) {
  var qtyData = {
    majorUnitVal: `${
      (qty === 0 ? "" : getCurrencyNumberWithOneDigit(qty)) +
      (qtyUnit.toLowerCase() === "loads" ||
      qtyUnit.toLowerCase() === "pieces" ||
      qtyUnit.toLowerCase() === "kgs"
        ? ""
        : " " + getCropUnit(qtyUnit))
    } ${
      qty === 0 || qty === null
        ? ""
        : weight === 0 || weight === null
        ? ""
        : " | "
    }`,
    minorUnitVal:
      getCurrencyNumberWithOneDigit(weight) +
      (qtyUnit.toLowerCase() === "loads" ||
      qtyUnit.toLowerCase() === "pieces" ||
      qtyUnit.toLowerCase() === "kgs"
        ? getCropUnit(qtyUnit)
        : weight === 0 || weight === null
        ? ""
        : " KGS"),
  };
  return qtyData;
}

function getWastage(wastage, qtyUnit, rateType) {
  return `${
    wastage !== 0
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

export default function getMultibillPdfData(billData, { isDuplicate = false }) {
  var colorThemeInfo = getPdfThemeInfo(billData);
  var headerData = getPdfHeaderData(billData, {
    isBillView: true,
  });
  headerData["groupId"] = billData?.groupId;

  headerData["billId"] = {
    groupId: billData?.groupId,
    billNumber: 0,
  };
  headerData["billDate"] = moment(billData.billDate).format("DD-MMM-YYYY");
  var isFarmer = billData?.billInfo[0].partyType === "FARMER";
  var billType = isFarmer ? "BUYBILL" : "SELLBILL";
  return {
    buyerName: "",
    userType: `(${billData?.billInfo[0].partyType.toUpperCase()})`,
    transporter: "",
    isPaid: false,
    billType: billType,
    address: "",
    primaryColor: colorThemeInfo.primaryColor,
    lightColor: colorThemeInfo.lightColor,
    darkerColor: colorThemeInfo.darkerColor,
    isDuplicate: isDuplicate,
    headerData: headerData,
    mandiName: colorThemeInfo.mandiName.toUpperCase(),
    signatureUrl: colorThemeInfo.signatureUrl,
    billData: getData(billData),
    grossTotal: getCurrencyNumberWithSymbol(billData?.grossTotal),
    totalCogs:billData?.billInfo[0].partyType == 'BUYER' ? getCurrencyNumberWithSymbol(billData?.totalCOGS) : getCurrencyNumberWithSymbol(billData?.totalRevenue),
    totalExpenses: getCurrencyNumberWithSymbol(billData?.totalExpenses),
    isMultiBill: true,
  };
}
let updatedItem3 = [];
const getData = (billData) => {
  let arr = billData?.billInfo.map((party, i) => {
    return party.lineItems.map((item, key) => {
      return {
        name: party.partyType == 'BUYER' ? party.buyerName : party.farmerName,
        qty: getQuantityData(item.qty, item.qtyUnit, item.weight),
        cropName:
          item.cropName.toUpperCase() +
          (item.cropSufx == "" || item.cropSufx == null
            ? ""
            : `(${item.cropSufx.toUpperCase()})`),
        imageUrl: item.imageUrl,
        wastage: getWastage(item.wastage, item.qtyUnit, item.rateType),
        individualBags: getIndividualBags(item.bags),
        total: getCurrencyNumberWithOutSymbol(item.total),
        totalReceivables: party.partyType == 'BUYER' ? party.totalReceivable.toString() : party.totalPayables.toString(),
        isCropRepeat: false,
        isSubTotal: false,
        subTotal: "",
        sNo: key + 1,
        minorUnitVal: 0,
        majorUnitVal: 0,
        wastageVal: 0,
      };
    });
  });
  const merge3 = arr.flat(1);
  merge3.map((itemVal, j) => {
    merge3[j].sNo = j + 1;
    updatedItem3.push(merge3[j]);
  });

  console.log(updatedItem3, merge3, "iitems llast");
  return merge3;
};
