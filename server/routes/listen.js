module.exports.listen = (http, PORT) => {
  http.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
};
