function colorAdjust(color, amount) {
  // positive values for lighten the color
  // negative for darken the color
  return (
    "#" +
    color
      .replace(/^#/, "")
      .replace(/../g, (color) =>
        (
          "0" +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}
export default function getPdfThemeInfo(
  billData,
  fromMulti,
  fromLedger,
  ledgertype
) {
  // default shade in app is 80 per
  var settArray = JSON.parse(localStorage.getItem("settingsData"));
  var partyType = getPartyType(fromMulti, billData, fromLedger, ledgertype);
  var settingsDataArray;
  console.log(settArray, "settArray");
  if (settArray != null) {
    for (var i = 0; i < settArray.length; i++) {
      if (settArray[i].type == "BUY_BILL" && partyType == "FARMER") {
        settingsDataArray = settArray[i];
        console.log(settingsDataArray, "buy");
      } else if (settArray[i].type == "SELL_BILL" && partyType == "BUYER") {
        settingsDataArray = settArray[i];
        console.log(settingsDataArray, "sell");
      }
    }
  }
  if (settingsDataArray != null) {
    var settingsData = settingsDataArray;
    var primaryColor =
      settingsData.colorTheme !== "" ? settingsData.colorTheme : "#16A12B";
    var lightColor =
      colorAdjust(primaryColor, 180) == "#ffffff"
        ? colorAdjust(primaryColor, 40)
        : colorAdjust(primaryColor, 180);
    var darkerColor = colorAdjust(primaryColor, -30);
    return {
      primaryColor: primaryColor !== "" ? primaryColor : "#16A12B",
      lightColor: lightColor !== "" ? lightColor : "#12B82E",
      darkerColor: darkerColor !== "" ? darkerColor : "#0C7A1E",
      mandiName: settingsData.mandiName,
      signatureUrl: settingsData.drawnSign ? settingsData.signatureUrl : "",
    };
  } else {
    var primaryColor = "#16A12B";
    var lightColor =
      colorAdjust(primaryColor, 180) == "#ffffff"
        ? colorAdjust(primaryColor, 40)
        : colorAdjust(primaryColor, 180);
    var darkerColor = colorAdjust(primaryColor, -30);
    return {
      primaryColor: primaryColor !== "" ? primaryColor : "#16A12B",
      lightColor: lightColor !== "" ? lightColor : "#12B82E",
      darkerColor: darkerColor !== "" ? darkerColor : "#0C7A1E",
      mandiName: "",
      signatureUrl: "",
    };
  }
}

function getPartyType(fromMulti, billData, fromLedg, ledgertype) {
  console.log(ledgertype, "ledgertype");
  var str = "";
  if (fromMulti) {
    str = billData?.billInfo[0].partyType;
  } else if (fromLedg == true) {
    if (ledgertype == "SELLER") {
      str = "FARMER";
    } else {
      str = ledgertype;
    }
  } else {
    str = billData?.partyType;
  }
  return str;
}
