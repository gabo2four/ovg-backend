/**
 * Routes for products
 */

export const getProducts = (req, res) => {
  res.status(200).json({
    ok: true,
    body: "CACA",
  });
};

export const createRoom = (req, res) => {
  res.redirect(`http://127.0.0.1:5173/room/12`)
};

export const indexPage = (req, res) => {
  res.redirect(`http://127.0.0.1:5173/inicio`)
};

