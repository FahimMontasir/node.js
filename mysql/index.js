const express = require("express");
const app = express();
const sequelize = require("./db");
const Cart = require("./model/cart");
const CartItem = require("./model/cartItem");
const Order = require("./model/order");
const OrderItem = require("./model/orderItem");
const Product = require("./model/products");
const User = require("./model/user");

app.use(express.json());
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((ex) => console.log(ex));
});

app.post("/user", (req, res) => {
  User.create({
    name: req.body.name,
    email: req.body.email,
  })
    .then((result) => {
      res.send(result);
    })
    .catch((ex) => console.log(ex));
});

app.post("/", (req, res) => {
  req.user
    .createProduct({
      title: req.body.title,
      price: req.body.price,
      imageUrl: req.body.imageUrl,
      description: req.body.description,
    })
    .then((result) => {
      res.send(result);
    })
    .catch((ex) => console.log(ex));
});

app.get("/", (req, res) => {
  // Product.findAll()
  //only find specific user's products
  req.user
    .getProducts()
    .then((products) => res.send(products))
    .catch((ex) => clg(ex));
});

app.get("/:pk", (req, res) => {
  const pk = req.params.pk;
  Product.findByPk(pk)
    .then((product) => res.send(product))
    .catch((ex) => console.log(ex));

  // Product.findAll({ where: { id: pk } })
  //   .then((products) => res.send(products))
  //   .catch((ex) => console.log(ex));
});

app.put("/:pk", (req, res) => {
  const pk = req.params.pk;
  Product.findByPk(pk)
    .then((product) => {
      product.title = req.body.title;
      return product.save();
    })
    .then((result) => res.send(result))
    .catch((ex) => console.log(ex));
});

app.delete("/:pk", (req, res) => {
  const pk = req.params.pk;

  Product.findByPk(pk)
    .then((product) => {
      return product.destroy();
    })
    .then((result) => res.send(result))
    .catch((ex) => console.log(ex));
});

app.post("/createCart", (req, res) => {
  req.user
    .createCart()
    .then((result) => res.send(result))
    .catch((ex) => console.log(ex));
});

app.get("/cart", (req, res) => {
  req.user
    .getCart()
    .then((cart) => cart.getProducts())
    .then((products) => res.send(products))
    .catch((ex) => console.log(ex));
});

app.post("/cart/:id", (req, res) => {
  const prodId = req.params.id;
  let fetchedCart;
  let newQuantity = 1;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then((product) => {
      fetchedCart
        .addProduct(product, {
          through: { quantity: newQuantity },
        })
        .then(() => res.send(product.cartItem)); //!not updated value
    })
    .catch((ex) => console.log(ex));
});

app.delete("/cart/:id", (req, res) => {
  const prodId = req.params.id;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => res.send(result))
    .catch((ex) => res.status(404).send(ex));
});

const port = process.env.PORT || 3000;

//association(relationship between all table)
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => console.log(`listening port ${port}...`));
  })
  .catch((ex) => console.log("error", ex));

//-------------------------mysql2 manual------------------------------
// db.execute("SELECT * FROM sampletl")
//   .then((d) => console.log(d[0]))
//   .catch((ex) => console.log(ex));

// const fetchAll = () => {
//   return db.execute("SELECT * FROM sampletl");
// };
// app.get("/", (req, res) => {
//   fetchAll()
//     .then(([rows, fieldData]) => {
//       console.log(rows);
//       res.send(rows);
//     })
//     .catch((ex) => console.log(ex));
// });

// app.get("/:id", (req, res) => {
//   db.execute("SELECT * FROM sampletl WHERE sampletl.id = ?", [req.params.id])
//     .then(([rows]) => res.send(rows))
//     .catch((ex) => console.log(ex));
// });

// app.post("/", (req, res) => {
//   db.execute("INSERT INTO sampletl (name) VALUES (?)", [req.body.name])
//     .then(() => res.send("done"))
//     .catch((ex) => console.log(ex));
// });
