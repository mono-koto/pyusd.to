import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'nodejs'; // 'nodejs' is the default

export async function GET(request: NextRequest) {
  // const person = await findPersonById(123);
  return NextResponse.json(
    {
      body: request.body,
      query: request.nextUrl.search,
      cookies: request.cookies.getAll(),
    },
    {
      status: 200,
    }
  );
}

// import { createKysely } from '@vercel/postgres-kysely';

// interface Database {
//   person: PersonTable;
//   pet: PetTable;
//   movie: MovieTable;
// }

// const db = createKysely<Database>();

// await db
//   .insertInto('pet')
//   .values({ name: 'Catto', species: 'cat', owner_id: id })
//   .execute();

// const person = await db
//   .selectFrom('person')
//   .innerJoin('pet', 'pet.owner_id', 'person.id')
//   .select(['first_name', 'pet.name as pet_name'])
//   .where('person.id', '=', id)
//   .executeTakeFirst();
