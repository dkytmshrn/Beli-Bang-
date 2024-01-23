const request = require("supertest")
const app = require("../app")
const { User, Store, Order, sequelize } = require("../models")
const { signToken } = require("../helpers/jwt")

let validSellerToken, validSellerToken2, validSellerToken3, validCustomerToken, invalidToken, orderId

const dataSeller = {
  username: "Seller",
  email: "seller@mail.com",
  password: "seller",
  role: "Seller",
  phoneNumber: 12345,
  address: "Adress",
  profilePicture: "Image",
  location: {
    "type": "Point",
    "coordinates": [ 107.59278847659893, -6.942981263106864 ]
  }
}

const dataSeller2 = {
  username: "Seller2",
  email: "seller2@mail.com",
  password: "seller2",
  role: "Seller",
  phoneNumber: 12345,
  address: "Adress",
  profilePicture: "Image",
  location: {
    "type": "Point",
    "coordinates": [ 107.59278847659893, -6.942981263106864 ]
  }
}

const dataSeller3 = {
  username: "Seller3",
  email: "seller3@mail.com",
  password: "seller3",
  role: "Seller",
  phoneNumber: 12345,
  address: "Adress",
  profilePicture: "Image",
  location: {
    "type": "Point",
    "coordinates": [ 107.59278847659893, -6.942981263106864 ]
  }
}

const dataCustomer = {
  username: "Customer",
  email: "customer@mail.com",
  password: "customer",
  role: "Customer",
  phoneNumber: 12345,
  address: "Adress",
  profilePicture: "Image",
  location: {
    "type": "Point",
    "coordinates": [ 107.59278847659893, -6.942981263106864 ]
  }
}

const dataStore = {
  name: "Store",
  description: "Description",
  imageUrl: "Image"
}

const dataOrder = {
  status: "Success"
}

beforeAll((done) => {
  User.create(dataSeller)
    .then((seller) => {
      validSellerToken = signToken({ id: seller.id, email: seller.email })
      dataStore.UserId = seller.id
      return User.create(dataCustomer)
    })
    .then((customer) => {
      validCustomerToken = signToken({ id: customer.id, email: customer.email })
      invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfE"
      dataOrder.UserId = customer.id
      return Store.create(dataStore)
    })
    .then((store) => {
      dataOrder.StoreId = store.id
      return Order.create(dataOrder)
    })
    .then((order) => {
      orderId = order.id
      return User.create(dataSeller2)
    })
    .then((seller2) => {
      validSellerToken2 = signToken({ id: seller2.id, email: seller2.email })
      return User.create(dataSeller3)
    })
    .then((seller3) => {
      validSellerToken3 = signToken({ id: seller3.id, email: seller3.email })
      dataStore.UserId = seller3.id
      return Store.create(dataStore)
    })
    .then((store3) => {
      dataOrder.UserId = store3.id
      return Order.create(dataOrder)
    })
    .then(() => {
      done()
    })
    .catch((err) => {
      done(err)
    })
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Orders", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Stores", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Users", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
})

// SHOW ALL ORDER BY USER
describe("GET /orders/customer", () => {
  test("200 success get all User's orders", (done) => {
    request(app)
      .get("/orders/customer")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Array)
        expect(body.length).toBeGreaterThan(0)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get User's order with invalid token", (done) => {
    request(app)
      .get("/orders/customer")
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get User's order without token", (done) => {
    request(app)
      .get("/orders/customer")
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 get User's order who has not made an order", (done) => {
    request(app)
      .get("/orders/customer")
      .set("access_token", validSellerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "No order has been made")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// SHOW ALL ORDER BY SELLER
describe("GET /orders/seller", () => {
  test("200 success get all Seller's orders", (done) => {
    request(app)
      .get("/orders/seller")
      .set("access_token", validSellerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Object)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get Seller's order with invalid token", (done) => {
    request(app)
      .get("/orders/seller")
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get Seller's order without token", (done) => {
    request(app)
      .get("/orders/seller")
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 get order of seller without store", (done) => {
    request(app)
      .get("/orders/seller")
      .set("access_token", validSellerToken2)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Store not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 get Seller's order is empty", (done) => {
    request(app)
      .get("/orders/seller")
      .set("access_token", validSellerToken3)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "No order has been made")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// FIND ORDER BY ID
describe("GET /orders/:id", () => {
  test("200 success GET Order by ID", (done) => {
    request(app)
      .get(`/orders/${orderId}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toBeInstanceOf(Object)
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get Order with invalid token", (done) => {
    request(app)
      .get(`/orders/${orderId}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get Order with invalid token", (done) => {
    request(app)
      .get(`/orders/${orderId}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 get Order without token", (done) => {
    request(app)
      .get(`/orders/${orderId}`)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 get Order not in database", (done) => {
    request(app)
      .get("/orders/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Order Not Found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// CREATE ORDER
describe("POST /orders", () => {
  test("201 success POST new Order", (done) => {
    request(app)
      .post("/orders")
      .set("access_token", validCustomerToken)
      .send(dataOrder)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(201)
        expect(body).toHaveProperty("message", "Success creating order");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("400 post Order without StoreId", (done) => {
    request(app)
      .post("/orders")
      .set("access_token", validCustomerToken)
      .send({
        UserId: dataOrder.UserId
      })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(400)
        expect(body).toHaveProperty("message", "Store ID is required")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 post Order with invalid token", (done) => {
    request(app)
      .post("/orders")
      .set("access_token", invalidToken)
      .send(dataOrder)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 post Order without token", (done) => {
    request(app)
      .post("/orders")
      .send(dataOrder)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// UPDATE ORDER
describe("PUT /orders/:id", () => {
  test("200 success UPDATE Order by ID", (done) => {
    request(app)
      .put(`/orders/${orderId}`)
      .set("access_token", validSellerToken)
      .send({ status: 'Success' })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Success updating order status");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 update Order with invalid token", (done) => {
    request(app)
      .put(`/orders/${orderId}`)
      .set("access_token", invalidToken)
      .send({ status: 'Success' })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 update Order without token", (done) => {
    request(app)
      .put(`/orders/${orderId}`)
      .send({ status: 'Success' })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 update Order not in Database", (done) => {
    request(app)
      .put("/orders/99")
      .set("access_token", validSellerToken)
      .send({ status: 'Success' })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Order Not Found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// DELETE ORDER BY ID
describe("DELETE /orders/:id", () => {
  test("200 success DELETE Order by ID", (done) => {
    request(app)
      .delete(`/orders/${orderId}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Order has been deleted")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 delete Order with invalid token", (done) => {
    request(app)
      .delete(`/orders/${orderId}`)
      .set("access_token", invalidToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 delete Order without token", (done) => {
    request(app)
      .delete(`/orders/${orderId}`)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401);
        expect(body).toHaveProperty("message", "Invalid token");
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 delete Order not in database", (done) => {
    request(app)
      .delete("/orders/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Order Not Found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})