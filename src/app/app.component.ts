import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { MainComponent } from './main/main.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  title = 'kiyo';

  @ViewChild('img1', { static: true }) img1Ref!: ElementRef<HTMLImageElement>;
  @ViewChild('img2', { static: true }) img2Ref!: ElementRef<HTMLImageElement>;
  @ViewChild('heart', { static: true }) heartRef!: ElementRef<HTMLSpanElement>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    this.positionHeart();
    window.addEventListener('resize', this.positionHeart);
  }

  positionHeart = () => {
    const img1 = this.img1Ref.nativeElement;
    const img2 = this.img2Ref.nativeElement;
    const heart = this.heartRef.nativeElement;
    const parent = img1.parentElement as HTMLElement;

    const rect1 = img1.getBoundingClientRect();
    const rect2 = img2.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    // Center points of the images relative to parent
    const x1 = rect1.left - parentRect.left + rect1.width / 2;
    const y1 = rect1.top - parentRect.top + rect1.height / 2;
    const x2 = rect2.left - parentRect.left + rect2.width / 2;
    const y2 = rect2.top - parentRect.top + rect2.height / 2;

    // Midpoint
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // Offset heart to center
    const heartRect = heart.getBoundingClientRect();
    const heartW = heartRect.width;
    const heartH = heartRect.height;

    this.renderer.setStyle(heart, 'left', `${mx - heartW / 2}px`);
    this.renderer.setStyle(heart, 'top', `${my - heartH / 2}px`);
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.positionHeart);
  }
}
