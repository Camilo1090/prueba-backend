# GeosportsBackend

API REST for serving data from a MongoDB database.

## Deploy

- MongoDB database deployed with [mLab](https://mlab.com/)
- NodeJS app deployed at [Heroku](https://warm-refuge-26566.herokuapp.com/api)

## Run locally

1. Clone repository
2. Run ```npm install```
3. Run ```npm run dev``` to start mongodb and node app concurrently, if mongodb is already running then run ```npm start```

## Main User endpoint

### ```GET /users/count```

Returns number of users grouped by country

#### Parameters
- ```sex```: filter by user sex, female or male
- ```age.gte```: filter by age, greater than or equal
- ```age.lte```: filter by age, less than or equal

#### Example

- Request: ```/users/count?sex=female&age.gte=20```
- Response: ```[{
      _id: "COL",
      count: 10
  }, {
      _id: "USA",
      count: 15
  }]```
  
## CRUD User endpoints

### ```GET /users```

Lists all users

### ```POST /users```

Create a user

### ```GET /users/:id```

Get specific user

### ```PUT /users/:id```

Update a user

### ```DELETE /users/:id```

Delete a user
