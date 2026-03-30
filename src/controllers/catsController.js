import * as catsService from '../services/catsService.js';

export async function getCats(req, res, next) {
  try {
    const cats = await catsService.getCatsByUser(req.user.id);
    res.json(cats);
  } catch (err) { next(err); }
}

export async function getCat(req, res, next) {
  try {
    const cat = await catsService.getCatById(req.params.id, req.user.id);
    if (!cat) return res.status(404).json({ error: { message: 'Cat not found' } });
    res.json(cat);
  } catch (err) { next(err); }
}

export async function createCat(req, res, next) {
  try {
    const cat = await catsService.createCat(req.user.id, req.body);
    res.status(201).json(cat);
  } catch (err) { next(err); }
}

export async function updateCat(req, res, next) {
  try {
    const cat = await catsService.updateCat(req.params.id, req.user.id, req.body);
    if (!cat) return res.status(404).json({ error: { message: 'Cat not found' } });
    res.json(cat);
  } catch (err) { next(err); }
}

export async function deleteCat(req, res, next) {
  try {
    await catsService.deleteCat(req.params.id, req.user.id);
    res.json({ message: 'Cat deleted' });
  } catch (err) { next(err); }
}
