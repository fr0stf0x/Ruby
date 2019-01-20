export const globalColorsAndStyles = {
  color: {
    primary: "rgba(92, 99, 216, 1)",
    primaryLight: "rgba(175, 199, 242, .8)",
    primaryText: "rgb(1, 26, 68)",
    secondary: "rgba(200, 125, 231, 1)",
    secondaryLight: "rgba(231, 206, 239, .8)",
    secondaryText: "rgb(45, 2, 51)",
    error: "red"
  },
  style: {
    boxShadow: {
      borderRadius: 15,
      backgroundColor: "#fff",
      shadowOpacity: 0.6,
      shadowRadius: 10,
      shadowOffset: {
        width: 3,
        height: 2
      },
      shadowColor: "gray"
    },
    headerRightText: {
      fontSize: 17,
      color: "#2a72ef",
      paddingEnd: 10
    }
  }
};

const theme = {
  Button: {
    buttonStyle: {
      ...globalColorsAndStyles.style.boxShadow,
      // width: 300,
      height: 45,
      backgroundColor: "rgba(92, 99, 216, 1)",
      borderColor: "transparent",
      borderWidth: 0,
      borderRadius: 15,
      paddingHorizontal: 10,
      margin: 5
    }
  },
  Input: {
    containerStyle: {
      width: "85%",
      height: 50
    },
    placeholderTextColor: "#5b7296",
    inputContainerStyle: {
      ...globalColorsAndStyles.style.boxShadow,
      height: 50,
      width: "100%",
      paddingHorizontal: 5,
      borderStyle: "solid",
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: "rgb(255,255,255)",
      borderColor: "#4286f4"
    },
    autoCapitalize: "none",
    autoCorrect: false,
    clearButtonMode: "while-editing"
  }
};

export default theme;
