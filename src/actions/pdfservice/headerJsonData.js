function getBusinessDetailsModel() {
  var userBusinessData = JSON.parse(localStorage.getItem("businessDetails"));
  var personalData = JSON.parse(localStorage.getItem("personalDetails"));
  var address = userBusinessData.businessAddress.addressLine;
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
  var settingsData = JSON.parse(localStorage.getItem("settingsData"))[0];
  return {
    heading: settingsData.header.billTypeLabel.toUpperCase(),
    userLabel: settingsData.header.userLabel.toUpperCase(),
    logoUrl: settingsData.logoUrl,
  };
}

export default function getPdfHeaderData({
  isBillView = false,
  isPaymentReceipt = false,
}) {
  var userBusinessData = getBusinessDetailsModel();
  var pdfThemeInfo = getPdfThemeInfo();
  //   console.log(pdfThemeInfo);
  return {
    propriterName: userBusinessData.propriterName.toUpperCase(),
    mandiName: userBusinessData.mandiName.toUpperCase(),
    title: userBusinessData.title.toUpperCase(),
    address: userBusinessData.address.toUpperCase(),
    shopNo: userBusinessData.shopNo.toUpperCase(),
    shortCode: userBusinessData.shortCode.toUpperCase(),
    number: userBusinessData.number,
    altNumber: userBusinessData.altNumber,
    heading: pdfThemeInfo.heading.toUpperCase(),
    logoUrl: pdfThemeInfo.logoUrl,
    languageId: "te",
    userLabel: pdfThemeInfo.userLabel.toUpperCase(),
    isBillView: isBillView,
    isPaymentReceipt: isPaymentReceipt,
    isSingleBillView: true,
  };
}
