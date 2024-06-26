import { Page, expect, request, APIRequestContext } from '@playwright/test';
import { SearchPage } from '../../pages/search.page'
import dotenv from 'dotenv';
import { runInNewContext } from 'vm';


async function searchProduct ( page: Page ) {
  dotenv.config();
  await page.goto('https://www.mercadolibre.com.ar')
  const searchPage = new SearchPage(page);
  await searchPage.searchProduct('bicimoto');
  await searchPage.validateProductFound('bicimoto');
  await searchPage.gotoCart();
}

async function spotifyTest () {
  const apiRequestContext:APIRequestContext = await request.newContext();
  dotenv.config();
  const client_id: string = process.env.SPOTIFY_CLIENT_ID || "";
  const client_secret: string = process.env.SPOTIFY_CLIENT_SECRET || "";
  const artistCode:string = "4Z8W4fKeB5YxbusRsdQVPb";
  const artistName:string = "Radiohead";

  const responseAuth = await apiRequestContext.post( 'https://accounts.spotify.com/api/token', {
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


  const responseSearch = await apiRequestContext.get( 'https://api.spotify.com/v1/artists/' + artistCode, {
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
};

module.exports = {searchProduct, spotifyTest};