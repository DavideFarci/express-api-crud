module.exports = function (req, res, next) {
  res.status("404").json({ message: "Pagina non trovata" });
};
