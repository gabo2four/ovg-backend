import { server } from "./src/components/socketio/socketio";

server.listen(process.env.PORT, () =>
  console.log("listening on port http://localhost:5001")
);
