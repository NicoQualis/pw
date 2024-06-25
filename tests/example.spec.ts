import { expect, test } from '@playwright/test';
import { SearchPage } from '../pages/search.page'
import dotenv from 'dotenv';
import { queryPg, queryMysql } from '../db/database';
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

test('bd PG example', {
  tag: ['@dbPg','@QC-4321'],
}, async () => {
  const username = 'testqualis2';
  const password = 'password123';

  await queryPg<Account>('INSERT INTO accounts (username, password) VALUES ($1, $2)', [username, password]);

  const res = await queryPg<Account>('SELECT * FROM accounts WHERE username = $1', [username]);
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


test('bd PG example 2', {
  tag: '@db2 Pg',
}, async () => {
  const comida = 'milanesas con pure';
  const cantdias = '6 dias';

  await queryPg<Dieta>('INSERT INTO dieta (comida, cantdias) VALUES ($1, $2)', [comida, cantdias]);

  const res = await queryPg<Dieta>('SELECT * FROM dieta WHERE comida = $1', [comida]);
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


test('bd MYSQL example', {
  tag: '@dbMysql',
}, async () => {
  const username = 'testqualis2';
  const password = 'password123';

  await queryMysql<Account>('INSERT INTO accounts (username, password) VALUES (?, ?)', [username, password]);

  const res = await queryMysql<Account>('SELECT * FROM accounts WHERE username = ?', [username]);
  console.log(res);

  expect(res.length).toBeGreaterThan(0);

  const lastUser = res[res.length - 1];

  if (lastUser) {
    expect(lastUser.username).toBe(username);
    expect(lastUser.password).toBe(password);
  } else {
    throw new Error('No se encontraron registros en la tabla accounts');
  }
});


test('bd2 MYSQL example', {
  tag: '@db2Mysql',
}, async () => {
  const comida = 'milanesas con pure';
  const cantdias = '6 dias';

  await queryMysql<Dieta>('INSERT INTO dieta (comida, cantdias) VALUES (?, ?)', [comida, cantdias]);

  const res = await queryMysql<Dieta>('SELECT * FROM dieta WHERE comida = ?', [comida]);
  console.log(res);

  expect(res.length).toBeGreaterThan(0);

  const lastUser = res[res.length - 1];

  if (lastUser) {
    expect(lastUser.comida).toBe(comida);
    expect(lastUser.cantdias).toBe(cantdias);
  } else {
    throw new Error('No se encontraron registros en la tabla dieta');
  }
});


test('whatsapp', {
  tag: '@whatsapp',
}, async ({request}) => {
  const url = 'https://graph.facebook.com/v19.0/358871443971700/messages';
  const headers = {
    'Authorization': 'Bearer EAATdz5keKVkBO6Wm9ELwmfQaqqiy38Rck7tUtzH1ArtqNBWlIoC0aQw0PERtDeIfGfwPjXZB13zVFafX4OHJv4MfZA1mgUzceV3ji23BMTz57lieG4kqV0z0t8C4mlGPm758ms3AQGDOPZAYPIZBpEDAxHyM66KkmZCZCCYPhFjtMiZBIwUuqq2x6eZC0XkWUCj9myxJEN7ipwPZAN1VYd0sZD',
    'Content-Type': 'application/json'
  };
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: "individual",
    to: '+541130612070',
    type: 'text',
    text: {
    body: "Hola"
     }
  };

  const response = await request.post(url, {
    headers,
    data
  });

  expect(response.status()).toBe(200);
  const responseBody = await response.json();
  console.log(responseBody);
});