import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState }  from "react";
import { config } from "../App";
import "./ProductCard.css";


const ProductCard = ({ product, handleAddToCart }) => {
      // console.log(product)
  return (
    <Card className="card">
      <CardMedia component="img" alt={product.name} image={product.image}/>
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography fontWeight="700">${product.cost}</Typography>
        <Rating value={product.rating} readOnly/>
      </CardContent>
      <CardActions>
        <Button variant="contained" fullWidth startIcon={<AddShoppingCartOutlined/>} onClick={()=>{
          handleAddToCart({productId:product._id,qty:1});
         
        }}>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
