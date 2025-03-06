import { App } from '@cloudbase/js-sdk';

declare module '@cloudbase/js-sdk' {
  interface App {
    ai(): Promise<{
      createModel(name: string): any;
    }>;
  }
} 