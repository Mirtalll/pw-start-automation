import { allure } from 'allure-playwright';
import type { Page, Request, Route } from '@playwright/test';

export type ApiRequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
type UrlMatcher = string | RegExp;
type MockHandler = (route: Route) => Promise<void>;

interface RegisteredMock {
  url: UrlMatcher;
  handler: MockHandler;
}

export interface ApiMockConfig {
  url: UrlMatcher;
  method?: ApiRequestMethod;
  status?: number;
  headers?: Record<string, string>;
  body?: unknown;
  contentType?: string;
  once?: boolean;
  delayMs?: number;
}

export type ApiMockOptions = Omit<ApiMockConfig, 'url' | 'body'>;

const API_RESOURCE_TYPES = new Set(['xhr', 'fetch']);

export class ApiMock {
  private readonly page: Page;
  private readonly registrations: RegisteredMock[] = [];

  constructor(page: Page) {
    this.page = page;
  }

  async mock(config: ApiMockConfig): Promise<void>;
  async mock(url: UrlMatcher, body?: unknown, options?: ApiMockOptions): Promise<void>;
  async mock(urlOrConfig: UrlMatcher | ApiMockConfig, body?: unknown, options: ApiMockOptions = {}): Promise<void> {
    const config = this.normalizeConfig(urlOrConfig, body, options);
    const description = `${config.method ?? 'ANY'} ${this.formatUrlMatcher(config.url)}`;
    let isConsumed = false;

    const handler: MockHandler = async (route: Route): Promise<void> => {
      const request = route.request();

      if (!this.shouldMock(request, config.method)) {
        await route.fallback();
        return;
      }

      if (config.once && isConsumed) {
        await route.fallback();
        return;
      }

      if (config.once) {
        isConsumed = true;
      }

      await allure.step(`Ответ мока API ${description}`, async () => {
        if (config.delayMs && config.delayMs > 0) {
          await this.delay(config.delayMs);
        }

        await route.fulfill(this.buildFulfillOptions(config));
      });

      if (config.once) {
        await this.unregister(config.url, handler);
      }
    };

    await allure.step(`Регистрация мока API ${description}`, async () => {
      await this.page.route(config.url, handler);
    });

    this.registrations.push({ url: config.url, handler });
  }

  async get(url: UrlMatcher, body?: unknown, options: Omit<ApiMockOptions, 'method'> = {}): Promise<void> {
    await this.mock(url, body, {
      ...options,
      method: 'GET',
    });
  }

  async post(url: UrlMatcher, body?: unknown, options: Omit<ApiMockOptions, 'method'> = {}): Promise<void> {
    await this.mock(url, body, {
      ...options,
      method: 'POST',
    });
  }

  async reset(): Promise<void> {
    await allure.step('Сброс моков API', async () => {
      const registrations = [...this.registrations];

      for (const registration of registrations) {
        await this.page.unroute(registration.url, registration.handler);
      }

      this.registrations.length = 0;
    });
  }

  private isApiRequest(request: Request): boolean {
    return API_RESOURCE_TYPES.has(request.resourceType());
  }

  private isMethodMatch(request: Request, method?: ApiRequestMethod): boolean {
    return method === undefined || request.method().toUpperCase() === method;
  }

  private shouldMock(request: Request, method?: ApiRequestMethod): boolean {
    return this.isApiRequest(request) && this.isMethodMatch(request, method);
  }

  private normalizeConfig(urlOrConfig: UrlMatcher | ApiMockConfig, body?: unknown, options: ApiMockOptions = {}): ApiMockConfig {
    if (typeof urlOrConfig === 'object' && urlOrConfig instanceof RegExp === false) {
      return {
        ...urlOrConfig,
        method: urlOrConfig.method?.toUpperCase() as ApiRequestMethod | undefined,
      };
    }

    return {
      url: urlOrConfig,
      body,
      ...options,
      method: options.method?.toUpperCase() as ApiRequestMethod | undefined,
    };
  }

  private buildFulfillOptions(config: ApiMockConfig): Parameters<Route['fulfill']>[0] {
    const fulfillOptions: Parameters<Route['fulfill']>[0] = {
      status: config.status ?? 200,
      headers: config.headers,
    };

    if (config.body === undefined) {
      if (config.contentType) {
        fulfillOptions.contentType = config.contentType;
      }

      return fulfillOptions;
    }

    if (!config.contentType || config.contentType.includes('json')) {
      return {
        ...fulfillOptions,
        json: config.body,
      };
    }

    return {
      ...fulfillOptions,
      body: typeof config.body === 'string' ? config.body : JSON.stringify(config.body),
      contentType: config.contentType,
    };
  }

  private formatUrlMatcher(url: string | RegExp): string {
    return typeof url === 'string' ? url : url.toString();
  }

  private async unregister(url: UrlMatcher, handler: MockHandler): Promise<void> {
    await this.page.unroute(url, handler);

    const registrationIndex = this.registrations.findIndex(registration => registration.url === url && registration.handler === handler);

    if (registrationIndex >= 0) {
      this.registrations.splice(registrationIndex, 1);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
