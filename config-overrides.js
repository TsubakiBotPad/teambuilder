// Source: https://dev.to/ansonh/simplest-way-to-install-babel-plugins-in-create-react-app-7i5

// Overrides create-react-app webpack configs without ejecting
// https://github.com/timarney/react-app-rewired

const { useBabelRc, override } = require("customize-cra");
module.exports = override(useBabelRc());
