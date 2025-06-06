const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");
const multer = require("multer");
const forwardFormData = require("./proxy");
const { createProxyMiddleware } = require("http-proxy-middleware");
const dotenv = require("dotenv");
const app = express();
const upload = multer({ dest: "uploads/" });
app.use(cors());
dotenv.config();


const endPoints = {
  prod: {
    customers: "http://customer_management_service:8003/api/customers",
    suppliers: "http://supplier_service:8006/api/suppliers",
    products: "http://product_management:8005",
    inventory: "http://inventory:8004/inventory",
    transaction: "http://transactions:8008",
    categorie: "http://product_management:8005/categorie",

  },
  dev: {
    customers: "http://localhost:8003/api/customers",
    suppliers: "http://localhost:8006/api/suppliers",
    products: "http://localhost:8005",
    inventory: "http://localhost:8004/inventory",
    transaction: "http://localhost:8008",
    categorie: "http://localhost:8005/categorie",
  }
}
function getEndPoing(target) {
  if (process.env.NODE_ENV === "production") {
    target = endPoints.prod[target];
  } else {
    target = endPoints.dev[target];
  }
  console.log('===>', target)
  return target
}

app.use((req, res, next) => {
  console.log(
    `Received ${req.method} request for ${req.url} at ${new Date().toISOString()}`
  );
  next();
})

//#region routes without files
app.use("/api/inventory", proxy(getEndPoing("inventory")));
app.use("/api/transaction", proxy(getEndPoing("transaction")));
app.use(
  "/api/products/categorie",
  createProxyMiddleware({
    target: getEndPoing("categorie"),
    changeOrigin: true,
    logLevel: "debug",
  })
);
//#endregion

//#region routes with files

app.use("/api/customers", upload.single("photo"), async (req, res) => {
  await forwardFormData(req, res, getEndPoing("customers"));
});

app.use("/api/products", upload.single("image"), async (req, res) => {
  await forwardFormData(req, res, getEndPoing("products"));
});
app.use("/api/suppliers", upload.single("logo"), async (req, res) => {
  await forwardFormData(req, res, getEndPoing("suppliers"));
});
//#endregion

app.listen(8000, () => {
  console.log("Gateway is Listening to Port 8000");
});
