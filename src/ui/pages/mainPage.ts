import type { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { DocSearchModalFragment } from '../fragments/docsearch-modal.fragment';
import { HeaderFragment } from '../fragments/header.fragment';

export class MainPage extends BasePage {
  headerFragment: HeaderFragment;
  docSearchModal: DocSearchModalFragment;

  constructor(page: Page) {
    super(page);
    this.headerFragment = new HeaderFragment(page);
    this.docSearchModal = new DocSearchModalFragment(page);
  }
}
