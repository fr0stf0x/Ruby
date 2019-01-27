import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-elements";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { connect } from "react-redux";
import appConstants from "~/appConstants";
import { mergeObj } from "~/Reducers/utils";
import selectors from "~/Selectors";
import { globalColorsAndStyles } from "~/Theme";
import ProductListItemWithInputs from "./Product/ProductListItemWithInputs";
import ReadOnlyProductListItem from "./Product/ReadOnlyProductListItem";
import SliderEntry, { colors, itemWidth, sliderWidth } from "./SliderEntry";

export const ProductItemContext = React.createContext(
  appConstants.productItemContext.SHOW
);

const ProductItem = ({ item: { id, detail, status }, index }) => {
  return (
    <ProductItemContext.Consumer>
      {context =>
        context.type === appConstants.productItemContext.SHOW ? (
          <TouchableOpacity
            onPress={() =>
              context.action
                ? context.action.navigation.navigate("ProductDetail", { id })
                : {}
            }
          >
            <ReadOnlyProductListItem
              id={id}
              key={index}
              index={index}
              status={status}
              detail={detail}
            />
          </TouchableOpacity>
        ) : (
          <ProductListItemWithInputs
            key={index}
            index={index}
            id={id}
            detail={detail}
            status={status}
            endpoint={context.type}
          />
        )
      }
    </ProductItemContext.Consumer>
  );
};

const renderItemWithParallax = ({ item, index }, parallaxProps) => {
  return (
    <SliderEntry
      data={item}
      even={(index + 1) % 2 === 0}
      parallax={true}
      parallaxProps={parallaxProps}
    />
  );
};

class ProductList extends React.Component {
  state = {
    activeIndex: 1
  };

  render() {
    const { productIds, productDetailsById } = this.props;
    if (productIds && productIds.length > 0) {
      return (
        <ProductItemContext.Consumer>
          {context =>
            context.type === appConstants.productItemContext.SHOW ? (
              <View>
                <Carousel
                  ref={c => {
                    this._carousel = c;
                  }}
                  data={productIds.map(id =>
                    mergeObj(productDetailsById[id], {
                      goToDetail: () =>
                        context.action.navigation.navigate("ProductDetail", {
                          id
                        })
                    })
                  )}
                  renderItem={renderItemWithParallax}
                  sliderWidth={sliderWidth}
                  itemWidth={itemWidth}
                  hasParallaxImages={true}
                  loop={true}
                  inactiveSlideScale={0.94}
                  inactiveSlideOpacity={0.7}
                  loopClonesPerSide={2}
                  autoplay={true}
                  autoplayDelay={100}
                  autoplayInterval={5000}
                  containerCustomStyle={styles.slider}
                  onSnapToItem={index => this.setState({ activeIndex: index })}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                />
                <Pagination
                  dotsLength={productIds.length}
                  activeDotIndex={this.state.activeIndex}
                  containerStyle={styles.paginationContainer}
                  dotColor={"rgba(255, 255, 255, 0.92)"}
                  dotStyle={styles.paginationDot}
                  inactiveDotColor={colors.black}
                  inactiveDotOpacity={0.4}
                  inactiveDotScale={0.6}
                  carouselRef={this._carousel}
                  tappableDots={!!this._carousel}
                />
              </View>
            ) : (
              <FlatList
                contentContainerStyle={{ paddingVertical: 10 }}
                refreshing={true}
                keyExtractor={(item, index) => index.toString()}
                data={productIds.map(id =>
                  mergeObj(productDetailsById[id], { id })
                )}
                renderItem={ProductItem}
              />
            )
          }
        </ProductItemContext.Consumer>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          padding: 20,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Text
          style={{ fontSize: 24, color: globalColorsAndStyles.color.error }}
        >
          <Text>Không có sản phẩm nào</Text>
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black
  },
  container: {
    flex: 1,
    backgroundColor: colors.background1
  },
  gradient: {
    ...StyleSheet.absoluteFillObject
  },
  scrollview: {
    flex: 1
  },
  exampleContainer: {
    paddingVertical: 30
  },
  exampleContainerDark: {
    backgroundColor: colors.black
  },
  exampleContainerLight: {
    backgroundColor: "white"
  },
  title: {
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center"
  },
  titleDark: {
    color: colors.black
  },
  subtitle: {
    marginTop: 5,
    paddingHorizontal: 30,
    backgroundColor: "transparent",
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center"
  },
  slider: {
    marginTop: 15,
    overflow: "visible" // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 8 // for custom animation
  },
  paginationContainer: {
    paddingVertical: 8
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 8
  }
});

export default connect(state => ({
  productDetailsById: selectors.data.getProducts(state).byId
}))(ProductList);
