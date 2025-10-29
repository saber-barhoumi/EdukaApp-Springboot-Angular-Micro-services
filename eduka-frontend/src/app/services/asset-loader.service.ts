import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AssetLoaderService {
  private renderer: Renderer2;
  private loadedAssets: Set<string> = new Set();

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  loadCss(href: string): void {
    if (this.loadedAssets.has(href)) return;
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
    this.loadedAssets.add(href);
  }

  loadJs(src: string): void {
    if (this.loadedAssets.has(src)) return;
    const script = this.renderer.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.async = false;
    this.renderer.appendChild(document.body, script);
    this.loadedAssets.add(src);
  }

  unloadAsset(url: string): void {
    const elements = Array.from(document.querySelectorAll(`link[href='${url}'],script[src='${url}']`));
    elements.forEach(el => el.parentNode?.removeChild(el));
    this.loadedAssets.delete(url);
  }

  unloadAll(): void {
    this.loadedAssets.forEach(url => this.unloadAsset(url));
    this.loadedAssets.clear();
  }
}
