# Code Citations

## License: unknown
https://github.com/kepingwang/pandora-app/tree/096b207e67866838b536835feacc41164863e814/server/index.js  
_Used for Express static file serving and SPA fallback in `server/index.js`._

```js
.join(__dirname, '../client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
```

## License: unknown
https://github.com/mrogers23458/clean-app/tree/b488b19e80d8192b7a5ad6f4c52763ea43362564/server/server.js  
_Used for static file serving and fallback route in `server/index.js`._

```js
express.static(path.join(__dirname, '../client/build'));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build'));
```
