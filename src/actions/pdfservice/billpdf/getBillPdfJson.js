import moment from "moment";
import {
  getCurrencyNumberWithOneDigit,
  getCurrencyNumberWithOutSymbol,
  getCurrencyNumberWithSymbol,
} from "../../../components/getCurrencyNumber";
import getIndividualTotalUnits from "../functions/getIndividualUnits";
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
        : getCropUnit(qtyUnit))
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
        : "KGS"),
  };
  return qtyData;
}
// function getTotalBalance() {
//   var crates = 0;
//   var bags = 0;
//   var kgs = 0;
//   var sacs = 0;
//   var boxes = 0;
//   var loads = 0;
//   var pieces = 0;
//   forEach((element) =>{
//     switch (toQuantityType[element.unitType]) {
//       case QuantityType.crates:
//         crates += element.quantity;
//         break;
//       case QuantityType.sacs:
//         sacs += element.quantity;
//         break;
//       case QuantityType.boxes:
//         boxes += element.quantity;
//         break;
//       case QuantityType.bags:
//         bags += element.quantity;
//         break;
//       case QuantityType.kgs:
//         kgs += element.quantity;
//         break;
//       case QuantityType.loads:
//         loads += element.quantity;
//         break;
//       case QuantityType.pieces:
//         pieces += element.quantity;
//         break;
//       default:
//         break;
//     }
//   });

//   var value = '';
//   if (boxes != 0) {
//     value += `${boxes} BX |`;
//   }
//   if (crates != 0) {
//     value += ` ${crates} C |`;
//   }
//   if (sacs != 0) {
//     value += ` ${sacs} S |`;
//   }
//   if (bags != 0) {
//     value += ` ${bags} BG |`;
//   }
//   if (kgs != 0) {
//     value += ` ${kgs} KGS |`;
//   }
//   if (loads != 0) {
//     value += ` ${loads} LDS |`;
//   }
//   if (pieces != 0) {
//     value += ` ${pieces} PCS |`;
//   }
//   if (value.isEmpty) {
//     return value = '0.0';
//   }
//   console.log(value,'string');
//   return value.removeLast();
// }
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
const getFinalLedgerBalance = (billData, billSettingsData, isFarmer) => {
  var includeComm = false;
  var includeRetComm = false;
  var isShown = false;
  var addRetComm = false;
  var isNotTrader =
    billData.partyType.toUpperCase() === "FARMER" ||
    billData.partyType.toUpperCase() === "SELLER";
  var systemSettingsData = JSON.parse(
    localStorage.getItem("systemSettingsData")
  );
  billSettingsData =
    billSettingsData != null
      ? billSettingsData
      : systemSettingsData.billSetting;
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
function getUniqueListBy(arr, key) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}
function renameTheObjectKey(objectData, oldKey, newKeyName) {
  return [
    ...new Map(
      objectData.map((item) => {
        item[newKeyName] = item[oldKey];
        delete item[oldKey];
        return [item[newKeyName], item];
      })
    ).values(),
  ];
}
function clean(objectList) {
  var newObjectList = [];
  objectList.forEach((value) => {
    if (value.settingsName !== "") {
      var str = value.settingsName.replace(/_/g, " ");
      let words = str.split(" ");
      words = words.map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ); // capitalize first letter of each word
      let result = words.join(" ");
      value.settingsName = result;
      newObjectList.push(value);
    }
  });
  return newObjectList;
}
function getGroupSettingsList() {
  const groupTotals = localStorage.getItem("groupPdfTotals");
  const groupTotalsList = JSON.parse(groupTotals);
  // const filteredList = getUniqueListBy(groupTotalsList, "settingName");
  // console.log(groupTotalsList,'totals')
  const renamedObjectValues = renameTheObjectKey(
    groupTotalsList,
    "settingName",
    "settingsName"
  );
  // const cleanedName = clean(renamedObjectValues);
  return groupTotalsList !== undefined ? groupTotalsList : [];
}

function getCashValue(billData, isFarmer) {
  return isFarmer
    ? billData?.cashPaid === 0 || billData?.cashPaid === null
      ? ""
      : " -" + getCurrencyNumberWithSymbol(billData?.cashPaid)
    : billData?.cashRcvd === 0 || billData?.cashRcvd === null
    ? ""
    : "-" + getCurrencyNumberWithSymbol(billData?.cashRcvd);
}
//todo this method will be moved to common
//   static String getIndividualTotalUnits(
//     List<IndividualBillViewViewModel> model,
//   ) {
//     double totalCrates = 0;
//     double totalSacs = 0;
//     double totalBoxes = 0;
//     double totalBags = 0;
//     double totalKgs = 0;
//     double totalLds = 0;
//     double totalPcs = 0;
//     final List<ParticularsViewModel> cropViewModel = [];
//     for (IndividualBillViewViewModel cropData in model) {
//       cropViewModel.addAll(cropData.lineItems);
//     }
//     for (ParticularsViewModel item in cropViewModel) {
//       switch (item.quantityType) {
//         case QuantityType.crates:
//           if (item.rateType == RatePerType.ratePerKg) {
//             totalKgs += item.totalWeight!.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//             totalCrates += item.qty;
//           } else {
//             totalCrates += item.qty.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           }
//           break;
//         case QuantityType.sacs:
//           if (item.rateType == RatePerType.ratePerKg) {
//             totalKgs += item.totalWeight!.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//             totalSacs += item.qty;
//           } else {
//             totalSacs += item.qty.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           }
//           break;
//         case QuantityType.boxes:
//           if (item.rateType == RatePerType.ratePerKg) {
//             totalKgs += item.totalWeight!.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//             totalBoxes += item.qty;
//           } else {
//             totalBoxes += item.qty.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           }
//           break;
//         case QuantityType.bags:
//           if (item.rateType == RatePerType.ratePerKg) {
//             totalKgs += item.totalWeight!.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//             totalBags += item.qty;
//           } else {
//             totalBags += item.qty.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           }
//           break;
//         case QuantityType.kgs:
//           totalKgs += item.totalWeight!.isIncludeWastage(
//               wastage: item.wastage,
//               wastageSettings: model.first.wastageSettings);
//           break;
//         case QuantityType.loads:
//           totalLds += item.totalWeight!.isIncludeWastage(
//               wastage: item.wastage,
//               wastageSettings: model.first.wastageSettings);
//           break;
//         case QuantityType.pieces:
//           if (item.rateType == RatePerType.ratePerPackage) {
//             switch (item.packageType) {
//               case PackageType.crates:
//                 totalCrates += item.qty.isIncludeWastage(
//                     wastage: item.wastage,
//                     wastageSettings: model.first.wastageSettings);
//                 break;
//               case PackageType.sacs:
//                 totalSacs += item.qty.isIncludeWastage(
//                     wastage: item.wastage,
//                     wastageSettings: model.first.wastageSettings);
//                 break;
//               case PackageType.boxes:
//                 totalBoxes += item.qty.isIncludeWastage(
//                     wastage: item.wastage,
//                     wastageSettings: model.first.wastageSettings);
//                 break;
//               case PackageType.bags:
//                 totalBags += item.qty.isIncludeWastage(
//                     wastage: item.wastage,
//                     wastageSettings: model.first.wastageSettings);
//                 break;
//             }
//           } else if (item.rateType == RatePerType.ratePerQuantity) {
//             totalPcs += item.qty.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           } else {
//             totalPcs += item.totalWeight!.isIncludeWastage(
//                 wastage: item.wastage,
//                 wastageSettings: model.first.wastageSettings);
//           }
//           break;
//       }
//     }
//     String result = '';
//     if (totalBoxes != 0) {
//       result += '$totalBoxes BX |';
//     }
//     if (totalCrates != 0) {
//       result += ' $totalCrates C |';
//     }
//     if (totalSacs != 0) {
//       result += ' $totalSacs S |';
//     }
//     if (totalBags != 0) {
//       result += ' $totalBags BG |';
//     }
//     if (totalKgs != 0) {
//       result += ' $totalKgs KGS |';
//     }
//     if (totalLds != 0) {
//       result += ' $totalLds LDS |';
//     }
//     if (totalPcs != 0) {
//       result += ' $totalPcs PCS |';
//     }
//     return result.removeLast();
//   }
// }

export default function getBillPdfJson(billData, { isDuplicate = false }) {
  var colorThemeInfo = getPdfThemeInfo();
  var headerData = getPdfHeaderData({
    isBillView: true,
  });
  headerData["groupId"] = 0;

  headerData["billId"] = {
    groupId: 0,
    billNumber: billData.billId.toString(),
  };
  headerData["billDate"] = moment(billData.billDate).format("DD-MMM-YYYY");
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
        lotId: item.lotId != null ? item.lotId : "-",
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
    totalBillAmount: localStorage.getItem("totalSelectedBillAmount").toString(),
    groupSettings: getGroupSettingsList(),
    cashValue: getCashValue(billData, isFarmer),
    cashValueComment:
      billData.cashPaidCmnt === null ? "" : billData.cashPaidCmnt,
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
