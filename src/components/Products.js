import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import Cart from "./Cart";
import { ConstructionOutlined } from "@mui/icons-material";
const Products = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [cartData, setCartData] = useState([]);
  const [token, setToken] = useState("");

  useEffect(() => {
    (async () => {
      let productData = await performAPICall();
      setProducts(productData);
      let token = await getAuthToken();
      setToken(token);
      let cart = await fetchCart(token);
      setCartData(cart);
      setLoading(false);
    })();
  }, []);

  //TODO CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns {Arrray.<Product>}
   *    Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successfull response from backend:
   */
  const performAPICall = async () => {
    try {
      const res = await axios.get(`${config.endpoint}/products`);
      return await res.data;
    } catch (error) {
      return error.response;
    }
  };

  //TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *  Text user types in the search bar. To filter the displayed products
   *
   * @returns {Array.<Product>}
   *  Array of objects with complete data on filtered set of products based on this text.
   *
   * API endpoint -"GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
    try {
      let res = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      // console.log(res)
      setProducts(res.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setProducts([]);
      }
    }
  };
  //TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with deboounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param { { target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout);
    let timerId = setTimeout(() => {
      performSearch(event.target.value);
    }, 1000);
    setDebounceTimeout(timerId);
    setSearchText(event.target.value);
  };

  const getAuthToken = async () => {
    let tempToken = await localStorage.getItem("token");
    return tempToken;
  };

  /**
   *
   * @param {string} token
   * 
   * @returns { Array.<{ productId: String, qty: Number }> } cartData
   *
   */
  const fetchCart = async (token) => {
    if (!token) {
      // console.log("no token found");
      return;
    }

    try {
      const cartData = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      return cartData.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        enqueueSnackbar(error.response.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch the cart details. Check that the backend is running, reachable and returns JSON",
          { variant: "error" }
        );
      }
      console.log(error.response);
      return null;
    }
  };


   /**
   *
   * @param {Array} token
   * @param {string} productId
   * 
   * @returns { Boolean } 
   *
   */

  const isItemInCart =  (items, productId) => {
    for (const item of items) {
      if (item.productId === productId) return true;
    }
    return false;
  };


   /**
   *
   * @param {string} token
   * @param {Array} items
   * @param {Array} products
   * @param {string} productId
   * @param {Number} qty
   * @param {{preventDefault: boolean}} options
   */
  const handleAddToCart = async (
   { token=localStorage.getItem("token"),
    items=cartData,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }}
  ) => {
    // console.log(productId,qty)
    if (!token || !productId ) return;
    if (options.preventDuplicate === true) {
      try {
        const res = await axios.post(
          `${config.endpoint}/cart`,
          { productId, qty },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        setCartData(res.data);
        enqueueSnackbar("Item Updated", { variant: "success" });
      } catch (error) {
        console.log(error)

        enqueueSnackbar(
          "Could not fetch the cart details. Check that the backend is running, reachable and returns JSON",
          { variant: "error" }
        );
      }
    } else {
      let isInCart=isItemInCart(items, productId)
      if (!isInCart) {
        try {
          const res = await axios.post(
            `${config.endpoint}/cart`,
            { productId, qty },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );
          setCartData(res.data);
          enqueueSnackbar("Item Added", { variant: "success" });
        } catch (error) {
          console.log(error)
          enqueueSnackbar(
            "Could not fetch the cart details. Check that the backend is running, reachable and returns JSON",
            { variant: "error" }
          );
        }
      } else {
        enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item", { variant: "warning" });
      }
    }
  };


  return (
    <div>
      <Header>
        <TextField
          className="search-desktop"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          value={searchText}
          onChange={(e) => {
            debounceSearch(e, debounceTimeout);
          }}
        ></TextField>
      </Header>
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={(e) => {
          debounceSearch(e, debounceTimeout);
        }}
      ></TextField>
      <Grid container sx={{ flexDirection: { xs: "column", md: "row" } }}>
        <Grid item md={token ? 8 : 12}>
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s{" "}
                  <span className="hero-highlight">FASTEST DELIVERY</span> to
                  your door step
                </p>
              </Box>
            </Grid>

            {loading ? (
              <Box className="loading">
                <CircularProgress />
                <h4>Loading Products....</h4>
              </Box>
            ) : products.length ? (
              <Grid container spacing={2} paddingX="12px" paddingY="8px">
                {products.map((product) => (
                  <Grid
                    item
                    xs={6}
                    md={3}
                    key={product._id}
                    
                  >
                    <ProductCard product={product} handleAddToCart={handleAddToCart} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box className="loading">
                <SentimentDissatisfied />
                <h4>No Products Found.</h4>
              </Box>
            )}
          </Grid>
        </Grid>

        {token ? (
          cartData.length ? (
            <Grid item md={4} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart
                products={products}
                items={cartData}
                handleAddToCart={handleAddToCart}
              />
            </Grid>
          ) : (
            <Grid item md={4} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart products={products}
                items={cartData}
                handleAddToCart={handleAddToCart}/>
            </Grid>
          )
        ) : (
          <></>
        )}
      </Grid>

      <Footer />
    </div>
  );
};

export default Products;
