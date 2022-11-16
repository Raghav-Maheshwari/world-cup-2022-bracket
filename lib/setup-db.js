import clientPromise from "./mongodb";

export const setupDb = async () => {
  const client = await clientPromise;
  return client.db("world-cup-2022-bracket-db");
}