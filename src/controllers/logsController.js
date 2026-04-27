import * as logsService from '../services/logsService.js';
import * as catsService from '../services/catsService.js';

export async function getLogs(req, res, next) {
  try {
    // verifying that the cat belongs to this user
    const cat = await catsService.getCatById(req.params.catId, req.user.id);
    if (!cat) return res.status(404).json({ error: { message: 'Cat not found' } });

    const logs = await logsService.getLogsByCat(req.params.catId);
    res.json(logs);
  } catch (err) { next(err); }
}

export async function addLog(req, res, next) {
  try {
    const cat = await catsService.getCatById(req.params.catId, req.user.id);
    if (!cat) return res.status(404).json({ error: { message: 'Cat not found' } });

    if (!req.body.weight_kg) {
      return res.status(400).json({ error: { message: 'weight_kg is required' } });
    }

    const log = await logsService.addLog(req.params.catId, req.body);
    res.status(201).json(log);
  } catch (err) { next(err); }
}

export async function deleteLog(req, res, next) {
  try {
    await logsService.deleteLog(req.params.logId);
    res.json({ message: 'Log deleted' });
  } catch (err) { next(err); }
}
