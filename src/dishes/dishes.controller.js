const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
const dishExist = (req, res, next) => {
  const dishId = req.params.dishId
  const findDish = dishes.find((dish) => dish.id === dishId)
  if (!findDish) {
    return next({
      status: 404,
      message: `Dish does not exist`
    })
  }
  res.locals.dishesData = findDish
  next()
}

const ifNameIsMissingOrEmpty = (req, res, next) => {
  const { data: { name } } = req.body
  const findName = name;
  if (findName) {
    next()
  } else {
    return next({
      status: 400,
      message: `Dishes is missing a name`
    })
  }
}

const ifDescriptionIsMissing = (req, res, next) => {
  const { data: { description } } = req.body
  const findDescription = description;
  if (findDescription) {
    next()
  } else {
    return next({
      status: 400,
      message: `Dishes is missing a description`
    })
  }
}

const ifImageUrlIsMissingOrEmpty = (req, res, next) => {
  const { data: { image_url } } = req.body
  const findImageUrl = image_url;
  if (findImageUrl) {
    next()
  } else {
    return next({
      status: 400,
      message: `Dishes is missing a image_url`
    })
  }
}

const ifPriceIsMissingEmptyOrZero = (req, res, next) => {
  const { data: { price } } = req.body
  const findPrice = price;
  if (!findPrice || findPrice.length === 0 || findPrice < 0 || typeof findPrice != 'number') {
    return next({
      status: 400,
      message: `Dishes is missing a price`
    })
  }
  next()
}

const ifDataIdDoesNotMatch = (req, res, next) => {
  const dishId = req.params.dishId
  const { data: { id } } = req.body
  const findId = id
  if (dishId != findId && findId) {
    next({
      status: 400,
      message: `Dishes is missing an id. ${findId}. ${dishId}`
    })
//     if (!findId || findId.length === 0 || findId = undefined || findId = null) {
        
//     }
  } else {
    next()
  }
}


const create = (req, res) => {
  const { data: { id, name, description, price, image_url} = {}} = req.body
  const pushNewDishData = {
    id: nextId(),
    name,
    description,
    price,
    image_url
  }
  dishes.push(pushNewDishData)
  res.status(201).json({ data: pushNewDishData })
}

const read = (req, res) => {
  res.json({ data: res.locals.dishesData })
}

const update = (req, res) => {
  const findDishesData = res.locals.dishesData
  const { data: { id, name, description, image_url, price} = {}} = req.body
  findDishesData.id = id;
  findDishesData.name= name;
  findDishesData.description = description;
  findDishesData.image_url = image_url;
  findDishesData.price = price;
  res.json({ data: findDishesData })
}

const list = (req, res) => {
  res.json({ data: dishes })
}

module.exports = {
  create: [
    ifNameIsMissingOrEmpty,
    ifDescriptionIsMissing,
    ifImageUrlIsMissingOrEmpty,
    ifPriceIsMissingEmptyOrZero,
    create
  ],
  read: [
    dishExist,
    read
  ],
  update: [
    dishExist,
    ifDataIdDoesNotMatch,
    ifNameIsMissingOrEmpty,
    ifDescriptionIsMissing,
    ifImageUrlIsMissingOrEmpty,
    ifPriceIsMissingEmptyOrZero,
    update
  ],
  list
}