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

const Products = () => {
  const [products,setProducts]=useState([]);

  const performAPICall=async()=>{
    
  }
  return (
    <div>
      <Header></Header>

      <Grid container>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        <Grid container spacing={2} paddingX="12px" paddingY="8px">
         {products.map(product=>( <Grid item xs={6} md={3} key={product._id}>
            <ProductCard
              product={{
                product
              }}
            />
          </Grid>))}
        </Grid>
      </Grid>
      <Footer />
    </div>
  );
};

export default Products;
