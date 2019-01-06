export const globalColorsAndStyles = {
  color: {
    primary: "rgba(92, 99, 216, 1)",
    secondary: "rgba(200, 125, 231, 1)"
  },
  style: {
    boxShadow: {
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: {
        width: 3,
        height: 2
      },
      shadowColor: "gray"
    }
  }
};

const theme = {
  Button: {
    buttonStyle: {
      ...globalColorsAndStyles.style.boxShadow,
      width: 300,
      height: 45,
      backgroundColor: "rgba(92, 99, 216, 1)",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 15,
      margin: 10
    }
  },
  Input: {
    containerStyle: {
      width: "85%",
      marginVertical: 5
    },
    placeholderTextColor: "#5b7296",
    inputContainerStyle: {
      ...globalColorsAndStyles.style.boxShadow,
      width: "100%",
      paddingHorizontal: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.9)",
      borderColor: "#4286f4"
    },
    autoCapitalize: "none",
    autoCorrect: false,
    clearButtonMode: "always"
  }
};

export default theme;
