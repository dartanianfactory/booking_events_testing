export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-h3hhlf7Gw8Ce-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '1d',
};
