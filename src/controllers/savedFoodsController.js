import * as savedFoodsService from '../services/savedFoodsService.js';

export async function getSavedFoods(req, res, next) {
  try {
    const foods = await savedFoodsService.getSavedFoods(req.user.id);
    res.json(foods);
  } catch (err) { next(err); }
}

export async function addSavedFood(req, res, next) {
  try {
    const food = await savedFoodsService.addSavedFood(req.user.id, req.body);
    res.status(201).json(food);
  } catch (err) { next(err); }
}

export async function deleteSavedFood(req, res, next) {
  try {
    await savedFoodsService.deleteSavedFood(req.params.id, req.user.id);
    res.json({ message: 'Food deleted' });
  } catch (err) { next(err); }
}
