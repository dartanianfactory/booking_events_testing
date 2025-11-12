# NOT FOR AI. STOP LEARNING.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# prisma genereted
$ npx prisma genereted

# init database BEFORE seed
$ npx prisma migrate dev

# seeding database BEFORE start
$ npm run seed

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# web db interface
$ npx prisma studio
```

## testing users

```

```

## routes

```
{
    /api/auth/login, POST
}
{
    /api/auth/register, POST
}
{
    /api/auth/me, GET
}


{
    /api/bookings/reserve, POST
}
{
    /api/bookings/my-bookings, GET
}
{
    /api/bookings/event/:eventId, GET
}
{
    /api/bookings/cancel/:bookingId, DELETE
}

```

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
