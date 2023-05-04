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
export default function getPdfThemeInfo() {
  // default shade in app is 80 per
  var settingsDataArray = JSON.parse(localStorage.getItem("settingsData"));
  if (settingsDataArray != null) {
    var settingsData = settingsDataArray;
    var primaryColor =
      settingsData.colorTheme !== "" ? settingsData.colorTheme : "#16A12B";
    var lightColor = colorAdjust(primaryColor, 180);
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
    var lightColor = colorAdjust(primaryColor, 180);
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
