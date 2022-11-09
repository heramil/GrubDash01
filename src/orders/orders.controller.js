const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
const orderExist = (req, res, next) => {
  const orderId = req.params.orderId
  
  const findOrder = orders.find((order) => order.id === orderId)
  if (findOrder) {
    res.locals.ordersData = findOrder
    return next()
  }
//   if (!findOrder) {
    next({
      status: 404,
      message: `Order does not exist. ${orderId}`
    })
//   }
//   
//   next()
}

const ifDataIdDoesNotMatch = (req, res, next) => {
  const dishId = req.params.orderId
  console.log(dishId)
  const { id } = req.body.data
//   if (!id || id === null || id === undefined) {
//     res.locals.ordersData.id = res.locals.orderId
//   } else 
  if (!id || id === dishId) {
    return next()
  }
  
//   if (orderId !== id) {
    next({
      status: 400,
      message: `Order id does not match route id. Order: ${id}, Route: ${dishId}`
    })
//   } else {
//     return next()
//   }
  
}

const ifDeliverTo = (req, res, next) => {
  // This data is coming from a person making a request on the client
  // Get the data that is within deliverTo
  const { deliverTo } = req.body.data
  // If the data from deliverTo isn't true
  if (!deliverTo) {
    return next({
      status: 400,
      message: `Orders does not have a deliverTo`
    })
  }
  // Then send a status and message back stating it doesn't exist 
  next()
}

const ifMobileNumber = (req, res, next) => {
  // This data is coming from a person making a request on the client
  // Get the data that is within deliverTo
  const { mobileNumber } = req.body.data
  // If the data from deliverTo isn't true
  if (!mobileNumber) {
    return next({
      status: 400,
      message: `Orders does not have a mobileNumber`
    })
  }
  // Then send a status and message back stating it doesn't exist 
  next()
}

const ifDishes = (req, res, next) => {
  // This data is coming from a person making a request on the client
  // Get the data that is within deliverTo
  const { dishes } = req.body.data
  // If the data from deliverTo isn't true
  if (!dishes || dishes.length === 0 || !Array.isArray(dishes)) {
    return next({
      status: 400,
      message: `Orders does not have any dishesr`
    })
  }
  // Then send a status and message back stating it doesn't exist
  res.locals.dishes = dishes;
  next()
}

const ifDishQuantity = (req, res, next) => {
  const dishes = res.locals.dishes
  dishes.forEach((dish) => {
    const quantity  = dish.quantity
    if (!quantity || quantity <= 0 || typeof quantity !== 'number') {
      return next({
        status: 400,
        message: `Dish ${dishes.indexOf(dish)} must have a quantity that is an integer greater than 0`
      })
    }
  })
  next()
}

const ifStatus = (req, res, next) => {
  const { status } = req.body.data
  if (!status || status === 'invalid') {
    return next({
      status: 400,
      message: `Orders must have a status`
    })
  }
  next()
}

const ifOrderStatusPending = (req, res, next) => {
  const { status  } = res.locals.ordersData
  if (status !== 'pending') {
    return next({
      status: 400,
      message: `Order status is pending`
    })
  }
  next()
}

const create = (req, res) => {
  // We are talking new data from req.body and pushing it into ordersData
  // What are the keys within each index
  // Set the keys
  const { data: { id, deliverTo, mobileNumber, status, dishes } = {} } = req.body
  // Create a new object that holds the keys
  const newCreateData = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status,
    dishes
  }
  // Push the new data into ordersData
  orders.push(newCreateData)
  // Send the newly created data back as a response to the server
  res.status(201).json({ data: newCreateData })
}

const read = (req, res) => {
  res.json({ data: res.locals.ordersData })
}

const update = (req, res, next) => {
  const { orderId } = req.params
  const { id } = res.locals.ordersData
  Object.assign(res.locals.ordersData, req.body.data, { id })
  res.json({ data: res.locals.ordersData })
//   const findOrder = orders.find((order) => order.id === orderId)

//   findOrder.id = id;
//   findOrder.deliverTo = deliverTo;
//   findOrder.mobileNumber = mobileNumber;
//   findOrder.status = status;
//   findOrder.dishes = dishes;
//   res.json({ data: findOrder })
}

const destroy = (req, res) => {
  const index = orders.indexOf(res.locals.ordersData)
  orders.splice(index, 1)
  res.sendStatus(204)
}

const list = (req, res) => {
  res.json({ data: orders })
}

module.exports = {
  create: [ifDeliverTo, ifMobileNumber, ifDishes, ifDishQuantity, create],
  read: [orderExist, read],
  update: [
    orderExist,
    ifDataIdDoesNotMatch,
    ifDeliverTo,
    ifMobileNumber,
    ifDishes,
    ifDishQuantity,
    ifStatus,
    update
  ],
  delete: [orderExist, ifOrderStatusPending, destroy],
  list
}