const request = require("supertest")
const app = require("../app")
const { User, Store, Food, sequelize } = require("../models")
const { signToken } = require("../helpers/jwt")

let validSellerToken, validCustomerToken, invalidToken, foodId1, foodId2

const dataSeller1 = {
  username: "Seller1",
  email: "seller1@mail.com",
  password: "seller1",
  role: "Seller",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataSeller2 = {
  username: "Seller2",
  email: "seller2@mail.com",
  password: "seller2",
  role: "Seller",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataCustomer = {
  username: "Customer",
  email: "customer@mail.com",
  password: "customer",
  role: "Customer",
  phoneNumber: "12345",
  address: "Adress",
  profilePicture: "Image"
}

const dataStore = {
  name: "Store",
  status: true,
  description: "Description",
  imageUrl: "Image"
}

const dataFood = {
  name: "Food",
  price: 15000,
  description: "Food description",
  imageUrl: "Image"
}

beforeAll((done) => {
  User.create(dataSeller1)
    .then((seller1) => {
      validSellerToken = signToken({ id: seller1.id, email: seller1.email })
      dataStore.UserId = seller1.id
      return Store.create(dataStore)
    })
    .then((store1) => {
      dataFood.StoreId = store1.id
      return Food.create(dataFood)
    })
    .then((food1) => {
      foodId1 = food1.id
      return Food.create(dataFood)
    })
    .then((food2) => {
      foodId2 = food2.id
      return User.create(dataSeller2)
    })
    .then((seller2) => {
      dataStore.UserId = seller2.id
      return Store.create(dataStore)
    })
    .then(() => {
      return User.create(dataCustomer)
    })
    .then((customer) => {
      validCustomerToken = signToken({ id: customer.id, email: customer.email })
      invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXIwMUBtYWlsLmNvbSIsImlkIjoxLCJpYXQiOjE2MjI2MDk2NTF9.gShAB2qaCUjlnvNuM1MBWfE"
      done()
    })
    .catch((err) => {
      done(err)
    })
})

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("RatingFoods", null, {
    restartIdentity: true,
    truncate: true,
    cascade: true,
  })
  await sequelize.queryInterface.bulkDelete("Food", null, {
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

// CREATE RATING ===========================================================
describe("POST /foods/rating/:foodId", () => {
  test("201 success create new Rating", (done) => {
    request(app)
      .post(`/foods/rating/${foodId1}`)
      .set("access_token", validCustomerToken)
      .send({ score: 5 })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(201)
        expect(body).toHaveProperty("message", "Success rating food")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("401 create Rating with duplicate User ID", (done) => {
    request(app)
      .post(`/foods/rating/${foodId1}`)
      .set("access_token", validCustomerToken)
      .send({ score: 5 })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(401)
        expect(body).toHaveProperty("message", "Food already rated")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 create Rating with invalid token", (done) => {
    request(app)
      .post(`/foods/rating/${foodId1}`)
      .set("access_token", invalidToken)
      .send({ score: 5 })
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
  
  test("401 create Rating without token", (done) => {
    request(app)
      .post(`/foods/rating/${foodId1}`)
      .send({ score: 5 })
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
})

// SHOW FOODS RATING ======================================================
describe("GET /foods/rating/:storeId", () => {
  test("200 success get all Ratings", (done) => {
    request(app)
      .get(`/foods/rating/${foodId1}`)
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

  test("401 find Ratings with invalid token", (done) => {
    request(app)
      .get(`/foods/rating/${foodId1}`)
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
  
  test("401 find Ratings without token", (done) => {
    request(app)
      .get(`/foods/rating/${foodId1}`)
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

  test("404 find Ratings of a Food not in database", (done) => {
    request(app)
      .get("/foods/rating/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response
 
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Food not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("404 find no Ratings", (done) => {
    request(app)
      .get(`/foods/rating/${foodId2}`)
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response
 
        expect(status).toBe(404)
        expect(body).toHaveProperty("message", "Haven't got any rating yet")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// UPDATE RATING ============================================================
describe("PUT /foods/rating/:id", () => {
  test("200 success UPDATE Rating by ID", (done) => {
    request(app)
      .put("/foods/rating/1")
      .set("access_token", validCustomerToken)
      .send({ score: 4 })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Success updating rating")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("401 update Rating with invalid token", (done) => {
    request(app)
      .put("/foods/rating/1")
      .set("access_token", invalidToken)
      .send({ score: 4 })
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
  
  test("401 update Rating without token", (done) => {
    request(app)
      .put("/foods/rating/1")
      .send({ score: 4 })
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
  
  test("403 update Rating with incorrect User ID", (done) => {
    request(app)
      .put("/foods/rating/1")
      .set("access_token", validSellerToken)
      .send({ score: 4 })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "Not authorized")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
  
  test("404 update Order not in Database", (done) => {
    request(app)
      .put("/foods/rating/99")
      .set("access_token", validCustomerToken)
      .send({ score: 4 })
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Rating not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})

// DELETE RATING BY ID ==================================================
describe("DELETE /foods/rating/:id", () => {
  test("401 delete Rating with invalid token", (done) => {
    request(app)
      .delete("/foods/rating/1")
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
  
  test("401 delete Rating without token", (done) => {
    request(app)
      .delete("/foods/rating/1")
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

  test("403 delete Rating with incorrect User ID", (done) => {
    request(app)
      .delete("/foods/rating/1")
      .set("access_token", validSellerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(403);
        expect(body).toHaveProperty("message", "Not authorized")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("404 delete Rating not in Database", (done) => {
    request(app)
      .delete("/foods/rating/99")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(404);
        expect(body).toHaveProperty("message", "Rating not found")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })

  test("200 success DELETE Rating by ID", (done) => {
    request(app)
      .delete("/foods/rating/1")
      .set("access_token", validCustomerToken)
      .then((response) => {
        const { body, status } = response

        expect(status).toBe(200)
        expect(body).toHaveProperty("message", "Rating has been removed")
        done()
      })
      .catch((err) => {
        done(err)
      })
  })
})