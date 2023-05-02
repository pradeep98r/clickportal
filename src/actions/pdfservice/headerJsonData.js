function getBusinessDetailsModel() {
  var userBusinessData = JSON.parse(localStorage.getItem("businessDetails"));
  var personalData = JSON.parse(localStorage.getItem("personalDetails"));
  console.log(userBusinessData, "mainheader");
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
function getPdfThemeInfo() {
  // default shade in app is 80 per
  var settingData = JSON.parse(localStorage.getItem("settingsData"));
  if (settingData != null) {
    var settingsData = settingData[0];
    return {
      heading: settingsData.header.billTypeLabel.toUpperCase(),
      userLabel: settingsData.header.userLabel.toUpperCase(),
      logoUrl: settingsData.logoUrl,
    };
  } else {
    return null;
  }
}

export default function getPdfHeaderData({
  isBillView = false,
  isPaymentReceipt = false,
}) {
  var userBusinessData = getBusinessDetailsModel();
  console.log(userBusinessData, "header");
  var pdfThemeInfo = getPdfThemeInfo();
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
