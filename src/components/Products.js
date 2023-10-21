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
      let data = await performAPICall();
      setProducts(data);
      let token=await getAuthToken()
      setToken(token)
       fetchCart(token)
      setLoading(false);
    })();
  }, []);

  // useEffect(() => {
  //   // Load the token on mount
  //   setToken(getAuthToken());
  //   // Respond to the `storage` event
  //   function storageEventHandler(event) {
  //     if (event.key === "token") {
  //       setToken(event.newValue);
  //     }
  //   }
  //   // Hook up the event handler
  //   window.addEventListener("storage", storageEventHandler);
  //   return () => {
  //     // Remove the handler when the component unmounts
  //     window.removeEventListener("storage", storageEventHandler);
  //   };
  // }, []);

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
      return res.data;
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

  const getAuthToken =async () => {
    let tempToken = await localStorage.getItem("token");
    return tempToken
  };

  const fetchCart = async (token) => {
    console.log(token)
    if (!token) {
      console.log("no token found");
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

      setCartData(cartData.data);
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
      return null

      // return error.response;
    }
    // console.log(cartData.data)
  };

  const handleAddToCart = async (id) => {
    // console.log(id)
    // let data = { productId: id, qty: 1 };
    const isAdded = cartData.map((item) => item.productId === id);
    if (!isAdded) {
      const res = await axios.post(
        `${config.endpoint}/cart`,
        { productId: id, qty: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      setCartData(res.data);
    } else {
      enqueueSnackbar("item already in cart", { variant: "warn" });
    }
  };
  const handleQuantity = () => {};

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
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product._id);
                    }}
                  >
                    <ProductCard product={product} />
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
              <Cart products={products} items={cartData} />
            </Grid>
          ) : (
            <Grid item md={4} style={{ backgroundColor: "#E9F5E1" }}>
              <Cart />
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
