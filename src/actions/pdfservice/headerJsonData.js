function getBusinessDetailsModel() {
  var userBusinessData = JSON.parse(localStorage.getItem("businessDetails"));
  var personalData = JSON.parse(localStorage.getItem("personalDetails"));
  console.log(userBusinessData,'userBusinessData')
  var address =
    userBusinessData.businessAddress.addressLine +
    "," +
    userBusinessData.businessAddress.dist +
    "," +
    "pincode - " +
    userBusinessData.businessAddress.pincode +
    "," +
    userBusinessData.businessAddress.state;
  return {
    propriterName: personalData.ownerName.toUpperCase(),
    mandiName: userBusinessData.businessName.toUpperCase(),
    title: userBusinessData.businessType.toUpperCase(),
    shopNo: userBusinessData.shopNum.toUpperCase(),
    shortCode: userBusinessData.shortCode.toUpperCase(),
    address: address.toUpperCase(),
    number: userBusinessData.mobile,
    altNumber: userBusinessData.altMobile,
  };
}
function getPdfThemeInfo(billData ,fromMulti) {
  // default shade in app is 80 per
  var settArray = JSON.parse(localStorage.getItem("settingsData"));
  var partyType = fromMulti ? billData?.billInfo[0].partyType : billData?.partyType;
  var settingData;
  if(settArray != null){
    
    for (var i = 0; i < settArray.length; i++) {
      if (settArray[i].type == "BUY_BILL" && partyType == "FARMER") {
        settingData = settArray[i];
      } else if (
        settArray[i].type == "SELL_BILL" &&
        partyType == "BUYER"
      ) {
        settingData = settArray[i];
      }
    }
  }
  console.log(settArray,partyType,settingData,fromMulti,billData,'arr')
  if (settingData != null) {
    var settingsData = settingData;
    return {
      heading: settingsData.header.billTypeLabel.toUpperCase(),
      userLabel: settingsData.header.userLabel.toUpperCase(),
      logoUrl: settingsData.logoUrl,
    };
  } else {
    return null;
  }
}

export default function getPdfHeaderData(
  billData,fromMulti,
  { isBillView = false, isPaymentReceipt = false }
) {
  // console.log(isBillView)
  var userBusinessData = getBusinessDetailsModel();
  var pdfThemeInfo = getPdfThemeInfo(billData,fromMulti);
  console.log(userBusinessData,'userBusinessData')
  return {
    propriterName: userBusinessData.propriterName.toUpperCase(),
    mandiName: userBusinessData.mandiName.toUpperCase(),
    title: userBusinessData.title.toUpperCase(),
    address: userBusinessData.address.toUpperCase(),
    shopNo: userBusinessData.shopNo.toUpperCase(),
    shortCode: userBusinessData.shortCode.toUpperCase(),
    number: userBusinessData.number,
    altNumber: userBusinessData.altNumber,
    heading: pdfThemeInfo != null ? pdfThemeInfo.heading.toUpperCase() : "",
    logoUrl: pdfThemeInfo != null ? pdfThemeInfo.logoUrl : "",
    // need to add dynnamic lang selection
    languageId: "en",
    userLabel:
      pdfThemeInfo != null
        ? pdfThemeInfo.userLabel.toUpperCase()
        : "Proprietor".toUpperCase(),
    isBillView: isBillView,
    isPaymentReceipt: isPaymentReceipt,
    isSingleBillView: true,
  };
}
