import { expect, test } from '@playwright/test';
import { SearchPage } from '../pages/search.page'
import dotenv from 'dotenv';
import { query } from '../db/database';
import { Account, Dieta } from '../db/interfaces';

test.beforeEach(async ({ page }) => {
  dotenv.config();
  await page.goto('https://www.mercadolibre.com.ar')
})

test('search product', {
  tag: '@front',
}, async ({ page }) => {
  const searchPage = await new SearchPage(page);
  await searchPage.searchProduct('bicimoto');
  await searchPage.validateProductFound('bicimoto');
  await searchPage.gotoCart();
});

test('api Spotify', {
  tag: '@api',
}, async ({ request }) => {

  const client_id: string = process.env.SPOTIFY_CLIENT_ID || "";
  const client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || "";
  const artistCode:string = "4Z8W4fKeB5YxbusRsdQVPb";
  const artistName:string = "Radiohead";

  const responseAuth = await request.post( 'https://accounts.spotify.com/api/token', {
    params: {
      "grant_type": 'client_credentials',
      "client_id": client_id,
      "client_secret": client_secret,
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  let responseAuthJson = await responseAuth.json();
  console.log(responseAuthJson);
  expect(responseAuth.ok()).toBeTruthy();
  expect(responseAuth.status()).toBe(200);
  const accessToken: string = responseAuthJson.access_token;
  console.log(`Access Token: ${accessToken}`);


  const responseSearch = await request.get( 'https://api.spotify.com/v1/artists/' + artistCode, {
    headers: {
      "Authorization": "Bearer " + accessToken
    }
  });
  console.log(responseSearch);
  const responseSearchJson = await responseSearch.json();
  console.log(responseSearchJson);
  expect(responseSearch.ok()).toBeTruthy();
  expect(responseSearch.status()).toBe(200);
  expect(responseSearchJson.name).toBe(artistName)
  console.log(`Artist Name: ${responseSearchJson.name}`);
  console.log(`Image 2 URL: ${responseSearchJson.images[1].url}`);
});

test('bd example', {
  tag: '@db',
}, async () => {
  const username = 'testqualis2';
  const password = 'password123';

  await query<Account>('INSERT INTO accounts (username, password) VALUES ($1, $2)', [username, password]);

  const res = await query<Account>('SELECT * FROM accounts WHERE username = $1', [username]);
  console.log(res.rows);

  expect(res.rows.length).toBeGreaterThan(0);

  const lastUser = res.rows.length > 0 ? res.rows.pop() : undefined;

  if (lastUser) {
    expect(lastUser.username).toBe("username");
    expect(lastUser.password).toBe(password);
  } else {
    throw new Error('No se encontraron registros en la tabla accounts');
  }
});


test('bd example 2', {
  tag: '@db2',
}, async () => {
  const comida = 'milanesas con pure';
  const cantdias = '6 dias';

  await query<Dieta>('INSERT INTO dieta (comida, cantdias) VALUES ($1, $2)', [comida, cantdias]);

  const res = await query<Dieta>('SELECT * FROM dieta WHERE comida = $1', [comida]);
  console.log(res.rows);

  expect(res.rows.length).toBeGreaterThan(0);

  const lastUser = res.rows.length > 0 ? res.rows.pop() : undefined;

  if (lastUser) {
    expect(lastUser.comida).toBe(comida);
    expect(lastUser.cantdias).toBe(cantdias);
  } else {
    throw new Error('No se encontraron registros en la tabla dieta');
  }
});