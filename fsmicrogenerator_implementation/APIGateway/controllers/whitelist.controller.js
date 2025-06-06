const Whitelist = require("../models/whitelist.model");
const cacheService = require("../cache/redis.service");

const getCacheKey = (type, key) => `whitelist:${type}:${key}`;

exports.add = async (req, res) => {
  try {
    let data = new Whitelist(req.body);
    data = await data.save();
    await cacheService.invalidateTag("whitelist");
    return res.status(201).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.getAll = async (req, res) => {
  try {
    const key = cacheService.generateCacheKey("whitelist", "all");
    let data = await cacheService.get(key);
    if (!data || !data.length)
    data = await Whitelist.find().lean();
    if (data.length) await cacheService.set(key, data, ["whitelist"]);
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.getOne = async (req, res) => {
  try {
    const { type, key } = req.params;
    const cacheKey = getCacheKey(type, key);
    let data = await cacheService.get(key);
    if (!data) {
      data = await Whitelist.findOne({ type, key }).lean();
      await cacheService.set(cacheKey, data.rateLimit, ["whitelist"]);
    }
    if (!data)
      return res.status(404).json({ message: "Whitelist entry not found" });
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.update = async (req, res) => {
  try {
    const { type, key, rateLimit } = { ...req.params, ...req.body };
    const data = await Whitelist.findOneAndUpdate(
      { type, key },
      { rateLimit },
      { new: true, upsert: true }
    ).lean();
    await cacheService.invalidateTag("whitelist");
    return res.status(200).send(data);
  } catch (err) {
    return res.status(400).send(err);
  }
};

exports.delete = async (req, res) => {
  try {
    const { type, key } = req.params;
    const deleted = await Whitelist.findOneAndDelete({ type, key });
    if (!deleted)
      return res.status(404).json({ message: "Whitelist entry not found" });
    await cacheService.invalidateTag("whitelist");
    return res.status(204).send({ message: "Whitelist entry deleted" });
  } catch (err) {
    return res.status(400).send(err);
  }
};
