import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  imports: [RouterModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements AfterViewInit {
  @ViewChild('heroSection', { static: true }) heroSection!: ElementRef<HTMLElement>;

  constructor(private readonly renderer: Renderer2) {}

  ngAfterViewInit(): void { /* TODO document why this method 'ngAfterViewInit' is empty */ }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollY = window.scrollY;
    const heroEl = this.heroSection.nativeElement;
    const height = heroEl.offsetHeight;
    const opacity = Math.max(0, Math.min(1, 1 - scrollY / height));
    this.renderer.setStyle(heroEl, 'opacity', opacity.toString());
  }
}
