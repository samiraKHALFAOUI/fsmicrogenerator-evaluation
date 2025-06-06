const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

module.exports = async function forwardFormData(req, res, targetUrl) {
  try {
    const hasFile = req.file != null;
    const isMultipart = !!req.is("multipart/form-data");
    if (hasFile || isMultipart) {
      const form = new FormData();

      // Add non-file input
      for (const key in req.body) {
        form.append(key, req.body[key]);
      }

      // Add file if exists
      if (hasFile) {
        form.append(req.file.fieldname, fs.createReadStream(req.file.path), req.file.originalname);
      }

      // Forwared Request
      const response = await axios({
        method: req.method,
        url: targetUrl + req.url,
        data: form,
        headers: {
          ...form.getHeaders(),
        },
        validateStatus: (status) => status >= 200 && status < 400,
      });

      // Delete Temporary File
      if (hasFile) fs.unlinkSync(req.file.path);

      res.status(response.status).json(response.data);
    } else {
      const response = await axios({
        method: req.method,
        url: targetUrl + req.url,
        data: req.body,
        headers: {
          ...req.headers,
          "Content-Type": "application/json"
        },
        responseType: 'arraybuffer', // important pour le binaire
        validateStatus: (status) => status >= 200 && status < 400,
      });
      
      // On forward le bon type MIME (ex: image/png)
      const contentType = response.headers['content-type'];
      if (contentType && contentType.startsWith('image/')) {
        res.setHeader('Content-Type', contentType);
        return res.status(response.status).send(Buffer.from(response.data, 'binary'));
      }
      
      // sinon, c’est une réponse JSON classique
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(error.response?.status || 500).json({
      message: "Proxy error",
      detail: error.response?.data || error.message
    });
  }
};
