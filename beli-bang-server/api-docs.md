# API Documentation Beli Bang

## EndPoints :

List of available endpoints:

- `POST /register`
- `POST /login`
- `PATCH /users/username`
- `PATCH /users/password`
- `PATCH /users/phonenumber`
- `PATCH /users/address`
- `PATCH /users/profilepicture`
- `PATCH /users/location`
- `GET /users/:id`

- `GET /stores`
- `GET /stores/seller`
- `GET /stores/:id`
- `POST /stores`
- `PUT /stores/:id`
- `DELETE /stores/:id`

- `POST /foods`
- `GET /foods/:id`
- `PUT /foods/:id`
- `DELETE /foods/:id`

- `GET /orders/customer`
- `GET /orders/seller`
- `POST /orders`
- `GET /orders/:id`
- `PUT /orders/:id`
- `DELETE /orders/:id`

- `GET /ratingstores/:storeId`
- `POST /ratingstores/:storeId`
- `PUT /ratingstores/:id`
- `DELETE /ratingstores/:id`

- `GET /foods/rating/:foodId`
- `POST /foods/rating/:foodId`
- `DELETE /foods/rating/:id`

- `GET /likes/:storeId`
- `POST /likes/:storeId`
- `DELETE /likes/:id`

&nbsp;

## POST /register

#### Request:

- body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

_Response (201 - Created)_

```json
{
  "access_token": "string",
  "role": "string",
  "id": "integer"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required"
}
```

OR

```json
{
  "message": "Email must be unique"
}
```

OR

```json
{
  "message": "Email is required"
}
```

OR

```json
{
  "message": "Invalid email format"
}
```

OR

```json
{
  "message": "Password is required"
}
```

OR

```json
{
  "message": "Minimum password is 5 character"
}
```

OR

```json
{
  "message": "Role is required"
}
```

OR

```json
{
  "message": "Phone Number is required"
}
```

OR

```json
{
  "message": "Address is required"
}
```

&nbsp;

## POST /login

#### Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```

_Response (200 - OK)_

```json
{
  "access_token": "string",
  "username": "string",
  "role": "string",
  "id": "integer"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
```

OR

```json
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email/password"
}
```

&nbsp;

## PATCH /users/username

Description:

> edit username from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "username": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Username"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Username is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## PATCH /users/password

Description:

> change password from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "oldPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Password"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Password is required"
}
```

OR

```json
{
  "message": "Password does not match"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid password"
}
```

OR

```json
{
  "message": "Cannot use the old password"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## PATCH /users/phonenumber

Description:

> change Phone number from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "phoneNumber": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Phone Number"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Phone Number is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## PATCH /users/address

Description:

> change Address from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "address": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Address"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Address is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## PATCH /users/profilepicture

Description:

> change profile picture from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- file:

```json
{
  "fieldname": "profilePicture",
  "originalname": "image.png",
  "mimetype": "image/png",
  "buffer": "buffer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Profile Picture"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Profile Picture is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Error occured during photo upload. Please try again."
}
```

&nbsp;

## PATCH /users/location

Description:

> change Location from users to the database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "longitude": "string",
  "latitude": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success Edit Location"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Location is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## GET /users/:id

Description:

> Get users by id from database

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "username": "seller1",
  "email": "seller1@mail.com",
  "password": "string",
  "role": "Seller",
  "phoneNumber": "0899999",
  "address": "jl.indonesia",
  "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
  "location": {
    "type": "Point",
    "coordinates": [107.59278847659893, -6.942981263106864]
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "User Not Found"
}
```

&nbsp;

## - GET /stores

Description:

> get all stores from database

#### Request:

- Headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
{
        "id": 1,
        "name": "HISANA disuka",
        "status": true,
        "imageUrl": "image.jpg",
        "description": "Selamat datang di HISANA disuka destinasi terbaik untuk pencinta ayam goreng yang menginginkan cita rasa istimewa! Toko kami menawarkan pengalaman kuliner yang tak terlupakan dengan menu utama kami yang lezat dan beragam pilihan.",
        "UserId": 1,
        "User": {
            "id": 1,
            "username": "seller1",
            "email": "seller1@mail.com",
            "role": "Seller",
            "phoneNumber": "0899999",
            "address": "jl.indonesia",
            "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
            "location": {
                "type": "Point",
                "coordinates": [
                    107.59278847659893,
                    -6.942981263106864
                ]
            }
        }
    },
  ...
]
```

_Response (404 - Not Found)_

```json
{
  "message": "Sorry, there is no available store near your area"
}
```

&nbsp;

## GET /stores/seller

Description:

> Get store Seller from database

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "HISANA disuka",
  "status": true,
  "imageUrl": "image.jpg",
  "description": "Selamat datang di HISANA disuka destinasi terbaik untuk pencinta ayam goreng yang menginginkan cita rasa istimewa! Toko kami menawarkan pengalaman kuliner yang tak terlupakan dengan menu utama kami yang lezat dan beragam pilihan.",
  "UserId": 1,
  "Food": [
    {
      "id": 1,
      "name": "Ayam Goreng Original",
      "imageUrl": "https://live.staticflickr.com/65535/51364535374_64b9889b7d_b.jpg",
      "price": 15000,
      "description": "Ayam goreng Original dengan tepung rahasia",
      "StoreId": 1
    },
    {
      "id": 2,
      "name": "Fire Chicken",
      "imageUrl": "https://www.seriouseats.com/thmb/Efkd6pn1nhg5V5Jkpv2ns_UunlE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__images__2015__07__20150715-fried-chicken-01-6a95e8ae820a4ee4af40e05a9fc4e7e7.jpg",
      "price": 17000,
      "description": "Ayam goreng pedas dibalur dengan bubuk paprika dan juga cabai asli",
      "StoreId": 1
    },
    {
      "id": 3,
      "name": "Ayam Goreng Crispy",
      "imageUrl": "https://static.toiimg.com/thumb/61589069.cms?imgsize=788682&width=800&height=800",
      "price": 15000,
      "description": "Ayam goreng crispy yang renyah untuk pecinta crispy",
      "StoreId": 1
    }
  ],
  "User": {
    "id": 1,
    "username": "seller1",
    "email": "seller1@mail.com",
    "role": "Seller",
    "phoneNumber": "0899999",
    "address": "jl.indonesia",
    "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
    "location": {
      "type": "Point",
      "coordinates": [107.59278847659893, -6.942981263106864]
    }
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "You have not registered a store"
}
```

&nbsp;

## GET /stores/:id

Description:

> Get store by id from database

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "id": 2,
  "name": "Kedai Sate Taichan",
  "status": true,
  "imageUrl": "https://asset-2.tstatic.net/travel/foto/bank/images/sate-taican_20170207_185659.jpg",
  "description": "Selamat datang di Kedai Sate Taichan destinasi pilihan bagi para pencinta kuliner yang menginginkan sensasi pedas dan kenikmatan unik dari sate taichan! Toko kami menawarkan pengalaman gastronomi yang tak terlupakan dengan menu utama kami yang lezat dan menggugah selera.",
  "UserId": 2,
  "Food": [
    {
      "id": 4,
      "name": "Taichan Kulit",
      "imageUrl": "https://www.satetaichangoreng.com/images/s5.png",
      "price": 18000,
      "description": "Sate taichan yang menggunakan full kulit ayam untuk pecinta kulit",
      "StoreId": 2
    },
    {
      "id": 5,
      "name": "Taichan Paha",
      "imageUrl": "https://www.satetaichangoreng.com/images/s1.png",
      "price": 19000,
      "description": "Sate taichan yang menggunakan daging paha ayam agar empuk",
      "StoreId": 2
    },
    {
      "id": 6,
      "name": "Taichan Mozzarella",
      "imageUrl": "https://www.satetaichangoreng.com/images/taichanm.jpg",
      "price": 23000,
      "description": "Sate taichan yang dibalur dengan keju mozzarella",
      "StoreId": 2
    }
  ],
  "User": {
    "id": 2,
    "username": "seller2",
    "email": "seller2@mail.com",
    "role": "Seller",
    "phoneNumber": "0877777",
    "address": "jl.indonesia",
    "profilePicture": "https://ik.imagekit.io/h2rsqr1wu/BB_User/1700290578025_icon-teriak.png",
    "location": {
      "type": "Point",
      "coordinates": [107.59278847659893, -6.942981263106864]
    }
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Store Not Found"
}
```

&nbsp;

## POST /stores

Description:

> add new store to database

#### Request:

- Headers:

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- file:

```json
{
  "fieldname": "imageUrl",
  "originalname": "image.png",
  "mimetype": "image/png",
  "buffer": "buffer"
}
```

- Body:

```json
{
  "name": "string",
  "description": "string"
}
```

_Response (201 - Created)_

```json
{
  "message": "Success creating store"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Image store is required"
}
```

OR

```json
{
  "message": "Name is required"
}
```

OR

```json
{
  "message": "Description is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "You already have a store"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Error occured during photo upload. Please try again."
}
```

&nbsp;

## PUT /stores/:id

Description:

> Update store by id

#### Request:

- headers

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

- body:

```json
{
  "name": "string",
  "imageUrl": "string",
  "description": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success updating store information"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Store Not Found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden for the owner"
}
```

&nbsp;

## DELETE /stores/:id

Description:

> Delete store from database By id

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Store has been deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Store Not Found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden for the owner"
}
```

&nbsp;

## POST /foods

Description:

> Add new food to Store user

#### Request:

- headers

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- file:

```json
{
  "fieldname": "imageUrl",
  "originalname": "image.png",
  "mimetype": "image/png",
  "buffer": "buffer"
}
```

- body:

```json
{
  "name": "string",
  "price": "integer",
  "description": "string"
}
```

_Response (201 - Created)_

```json
{
  "message": "Successfully added food"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
```

OR

```json
{
  "message": "Image is required"
}
```

OR

```json
{
  "message": "Price is required"
}
```

OR

```json
{
  "message": "Description is required"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden for the seller"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Store Not Found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Error occured during photo upload. Please try again."
}
```

&nbsp;

## GET /foods/:id

Description:

> get food from database By id

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "id": 1,
  "name": "Ayam Goreng Original",
  "imageUrl": "https://live.staticflickr.com/65535/51364535374_64b9889b7d_b.jpg",
  "price": 15000,
  "description": "Ayam goreng Original dengan tepung rahasia",
  "StoreId": 1,
  "RatingFoods": []
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Food Not Found"
}
```

&nbsp;

## PUT /foods/:id

Description:

> Edit food from database By id

#### Request:

- headers

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- file:

```json
{
  "fieldname": "imageUrl",
  "originalname": "image.png",
  "mimetype": "image/png",
  "buffer": "buffer"
}
```

- params:

```json
{
  "id": "integer"
}
```

- body:

```json
{
  "name": "string",
  "price": "inter",
  "description": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success updating food information"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Name is required"
}
```

OR

```json
{
  "message": "Image is required"
}
```

OR

```json
{
  "message": "Price is required"
}
```

OR

```json
{
  "message": "Description is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Food Not Found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Not the Owner"
}
```

&nbsp;

## DELETE /foods/:id

Description:

> Delete food from database By id

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Food has been deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Food not found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Not the Owner"
}
```

&nbsp;

## GET /orders/customer

Description:

> Get orders from database By customer

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": 2,
    "StoreId": 1,
    "UserId": 3,
    "status": "Completed",
    "User": {
      "id": 3,
      "username": "customer",
      "email": "customer@mail.com",
      "role": "Customer",
      "phoneNumber": "0866666",
      "address": "jl.indonesia",
      "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
      "location": {
        "type": "Point",
        "coordinates": [107.59278847659893, -6.942981263106864]
      }
    },
    "Store": {
      "id": 1,
      "name": "HISANA disuka",
      "status": true,
      "imageUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikdLvYYrJls_oY_h6OyzmWQLijl9qdiMFiKUmEKBWr7O7R4wmo4cwQOG5cIMQzRDT-q9rkENIWYaKIw3GoJ8JFkocS-9a98pA_u9p18521Q6rlNv_7NDs3n2dccSR8QlmPXhQk6mUONSQCTp6SHt0AH7uUBpYiaKkIVUwdB6a216GIM2gRcfWcurpEhA/w1200-h630-p-k-no-nu/Beli%201set%20Peralatan%20Hisana%20Fried%20Chicken%20Modal%20Rp.%203,7%20Juta.jpg",
      "description": "Selamat datang di HISANA disuka destinasi terbaik untuk pencinta ayam goreng yang menginginkan cita rasa istimewa! Toko kami menawarkan pengalaman kuliner yang tak terlupakan dengan menu utama kami yang lezat dan beragam pilihan.",
      "UserId": 1,
      "User": {
        "id": 1,
        "username": "seller1",
        "email": "seller1@mail.com",
        "role": "Seller",
        "phoneNumber": "0899999",
        "address": "jl.indonesia",
        "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
        "location": {
          "type": "Point",
          "coordinates": [107.59278847659893, -6.942981263106864]
        }
      }
    }
  },
  ...
]
```

_Response (404 - Not Found)_

```json
{
  "message": "No order has been made"
}
```

&nbsp;

## GET /orders/seller

Description:

> Get orders from database By seller

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "locationSeller": {
    "type": "Point",
    "coordinates": [107.59278847659893, -6.942981263106864]
  },
  "orders": [
    {
      "id": 2,
      "StoreId": 1,
      "UserId": 3,
      "status": "Completed",
      "User": {
        "id": 3,
        "username": "customer",
        "email": "customer@mail.com",
        "role": "Customer",
        "phoneNumber": "0866666",
        "address": "jl.indonesia",
        "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
        "location": {
          "type": "Point",
          "coordinates": [107.59278847659893, -6.942981263106864]
        }
      }
    },
    ...
  ]
}
```

_Response (404 - Not Found)_

```json
{
  "message": "No order has been made"
}
```

&nbsp;

## POST /orders

Description:

> Add new order to seller from customer

#### Request:

- headers

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- body:

```json
{
  "StoreId": "string",
  "status": "integer"
}
```

_Response (201 - Created)_

```json
{
  "message": "Success creating order"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Store ID is require"
}
```

OR

```json
{
  "message": "User ID is required"
}
```

&nbsp;

## GET /orders/:id

Description:

> Get order from database By Id

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "store": {
    "id": 1,
    "name": "HISANA disuka",
    "status": true,
    "imageUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEikdLvYYrJls_oY_h6OyzmWQLijl9qdiMFiKUmEKBWr7O7R4wmo4cwQOG5cIMQzRDT-q9rkENIWYaKIw3GoJ8JFkocS-9a98pA_u9p18521Q6rlNv_7NDs3n2dccSR8QlmPXhQk6mUONSQCTp6SHt0AH7uUBpYiaKkIVUwdB6a216GIM2gRcfWcurpEhA/w1200-h630-p-k-no-nu/Beli%201set%20Peralatan%20Hisana%20Fried%20Chicken%20Modal%20Rp.%203,7%20Juta.jpg",
    "description": "Selamat datang di HISANA disuka destinasi terbaik untuk pencinta ayam goreng yang menginginkan cita rasa istimewa! Toko kami menawarkan pengalaman kuliner yang tak terlupakan dengan menu utama kami yang lezat dan beragam pilihan.",
    "UserId": 1,
    "User": {
      "id": 1,
      "username": "seller1",
      "email": "seller1@mail.com",
      "role": "Seller",
      "phoneNumber": "0899999",
      "address": "jl.indonesia",
      "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
      "location": {
        "type": "Point",
        "coordinates": [107.59278847659893, -6.942981263106864]
      }
    }
  },
  "customer": {
    "id": 3,
    "username": "customer",
    "email": "customer@mail.com",
    "role": "Customer",
    "phoneNumber": "0866666",
    "address": "jl.indonesia",
    "profilePicture": "https://www.mmm.ucar.edu/sites/default/files/img/default-avatar.jpg",
    "location": {
      "type": "Point",
      "coordinates": [107.59278847659893, -6.942981263106864]
    }
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Order Not Found"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid store/customer"
}
```

&nbsp;

## PUT /orders/:id

Description:

> Edit food from database By id

#### Request:

- headers

```json
{
  "Content-Type": "application/JSON",
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

- body:

```json
{
  "status": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Success updating order status"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Order Not Found"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "Forbidden for the seller"
}
```

&nbsp;

## DELETE /orders/:id"

Description:

> Delete food from database By id

#### Request:

- headers

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer"
}
```

_Response (200 - OK)_

```json
{
  "message": "Order has been deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Order Not Found"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```
