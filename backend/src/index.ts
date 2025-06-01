import { ApolloServer } from 'apollo-server';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { initDb } from './db';
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: number;
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return {};

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as TokenPayload;
      return { user: { id: payload.userId } };
    } catch (error) {
      return {};
    }
  },
});

const startServer = async () => {
  try {
    await initDb();
    const { url } = await server.listen();
    console.log(`🚀 Server ready at ${url}`);
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
