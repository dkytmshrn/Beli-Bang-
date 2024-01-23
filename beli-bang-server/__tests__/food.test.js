const request = require("supertest")
const app = require("../app")
const { User, Store, Food, sequelize } = require("../models")
const { signToken } = require("../helpers/jwt")
const ImageKit = require("imagekit")

jest.mock("imagekit")

let validSellerToken1, validSellerToken2, validCustomerToken, invalidToken, foodId, storeId

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

describe("When imagekit throws error", () => {
  beforeAll(() => {
    ImageKit.mockImplementation(() => {
      return {
        upload: () => {
          console.log("upload");
          return new Promise(resolve => {
            resolve({ 
              url: "test.jpg"
            })
          })
        }
      }
    })
  })

  beforeAll((done) => {
    User.create(dataSeller1)
      .then((seller1) => {
        validSellerToken1 = signToken({ id: seller1.id, email: seller1.email })
        dataStore.UserId = seller1.id
        return Store.create(dataStore)
      })
      .then((store) => {
        dataFood.StoreId = store.id
        storeId = store.id
        return Food.create(dataFood)
      })
      .then((food) => {
        foodId = food.id
        return User.create(dataSeller2)
      })
      .then((seller2) => {
        validSellerToken2 = signToken({ id: seller2.id, email: seller2.email })
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

  // CREATE FOOD ======================================================
  describe("POST /foods", () => {
    test("400 create Food without name", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken1)
        .field( "price", 15000 )
        .field( "description", "Description" )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Name is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 create Food without description", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Description is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 create Food without price", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "description", "Description" )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Price is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 create Food without image", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "Description" )
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Image must be provided")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("401 create Food with invalid token", (done) => {
      request(app)
        .post("/foods")
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
    
    test("401 create Food without token", (done) => {
      request(app)
        .post("/foods")
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

    test("403 create Food with customer role", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validCustomerToken)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(403)
          expect(body).toHaveProperty("message", "Forbidden for the seller")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("404 create Food without having Store", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken2)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "Description" )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(404)
          expect(body).toHaveProperty("message", "Please register your store first")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("201 success post new Food", (done) => {
      request(app)
        .post("/foods")
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "Description" )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(201)
          expect(body).toHaveProperty("message", "Successfully added food")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })


  // FIND FOOD BY ID ==================================================
  describe("GET /foods/:id", () => {
    test("200 success get Foods by ID", (done) => {
      request(app)
        .get(`/foods/${foodId}`)
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

    test("401 get Food with invalid token", (done) => {
      request(app)
        .get(`/foods/${foodId}`)
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
    
    test("401 get Food without token", (done) => {
      request(app)
        .get(`/foods/${foodId}`)
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

    test("404 get Food not in database", (done) => {
      request(app)
        .get("/foods/99")
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
  })

  // UPDATE FOOD ======================================================
  describe("PUT /foods/:id", () => {
    test("400 update Food without Image", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "Description" )
        .attach("imageUrl", "")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Image must be provided")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("400 update Food without name", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .field( "name", "" )
        .field( "price", 15000 )
        .field( "description", "Description" )
         .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Name is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 update Food without description", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "" )
         .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Description is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    
    test("400 update Food without price", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", "" )
        .field( "description", "Description" )
         .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response
  
          expect(status).toBe(400)
          expect(body).toHaveProperty("message", "Price is required")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("401 update Food with invalid token", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
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
    
    test("401 update Food without token", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
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

    test("403 update Food with incorrect User ID", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken2)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(403);
          expect(body).toHaveProperty("message", "Not the Owner")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("404 update Food not in Database", (done) => {
      request(app)
        .put("/foods/99")
        .set("access_token", validSellerToken1)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Food not found")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("200 success update Food by ID", (done) => {
      request(app)
        .put(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .field( "name", "Food" )
        .field( "price", 15000 )
        .field( "description", "Description" )
        .attach("imageUrl", "test/test.jpg")
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Success updating food information")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })

  // DELETE STORE BY ID
  describe("DELETE /stores/:id", () => {
    test("401 delete Food with invalid token", (done) => {
      request(app)
        .delete(`/foods/${foodId}`)
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
    
    test("401 delete Food without token", (done) => {
      request(app)
        .delete(`/foods/${foodId}`)
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

    test("403 delete Food with incorrect User ID", (done) => {
      request(app)
        .delete(`/foods/${foodId}`)
        .set("access_token", validSellerToken2)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(403);
          expect(body).toHaveProperty("message", "Not the Owner")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("404 delete Food not in Database", (done) => {
      request(app)
        .delete("/foods/99")
        .set("access_token", validSellerToken1)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(404);
          expect(body).toHaveProperty("message", "Food not found")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    test("200 success delete Food by ID", (done) => {
      request(app)
        .delete(`/foods/${foodId}`)
        .set("access_token", validSellerToken1)
        .then((response) => {
          const { body, status } = response

          expect(status).toBe(200)
          expect(body).toHaveProperty("message", "Food has been deleted")
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
})