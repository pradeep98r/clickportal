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
  var settingsData = JSON.parse(localStorage.getItem("settingsData"))[0];
  console.log(settingsData, "settingsData");
  var primaryColor =
    settingsData.colorTheme !== "" ? settingsData.colorTheme : "#16A12B";
  var lightColor = colorAdjust(primaryColor, 40);
  var darkerColor = colorAdjust(primaryColor, -40);
  return {
    primaryColor: primaryColor !== "" ? primaryColor : "#16A12B",
    lightColor: lightColor !== "" ? lightColor : "#12B82E",
    darkerColor: darkerColor !== "" ? darkerColor : "#0C7A1E",
    mandiName: settingsData.mandiName,
    signatureUrl: settingsData.drawnSign ? settingsData.signatureUrl : "",
  };
}
