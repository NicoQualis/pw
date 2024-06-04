import {Locator, Page, expect} from '@playwright/test'

export class SearchPage {
    page: Page;
    searchBar: Locator;
    searchButton: Locator;
    testSearched: Locator;
    testElement: Locator;
    
    constructor(page: Page){
        this.page = page;
        this.searchBar = page.getByPlaceholder('Buscar productos, marcas y má');
        this.searchButton = page.getByRole('button', { name: 'Buscar' });
        this.testSearched = page.getByRole('heading', { name: 'Bicimoto', exact: true });
        this.testElement = page.locator("[title='Carrito']");
    }

    async searchProduct(nameProduct:string) {
        await this.searchBar.fill(nameProduct);
        await this.searchButton.click();
    }

    async validateProductFound(nameProduct:string) {
        await expect(this.testSearched).toContainText(nameProduct,{ignoreCase:true});
    }

    async gotoCart() {
        await this.testElement.click();
    }
}