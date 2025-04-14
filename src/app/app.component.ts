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
  @ViewChild('lineContainer', { static: true }) lineContainerRef!: ElementRef<HTMLDivElement>;

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

    // --- Create a line using DOM element with transforms ---
    const lineContainer = this.lineContainerRef.nativeElement;
    
    // Clear any existing line
    while (lineContainer.firstChild) {
      lineContainer.removeChild(lineContainer.firstChild);
    }
    
    // Create a new line element
    const line = document.createElement('div');
    
    // Calculate the length and angle of the line
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    // Style the line
    this.renderer.setStyle(line, 'position', 'absolute');
    this.renderer.setStyle(line, 'left', `${x1}px`);
    this.renderer.setStyle(line, 'top', `${y1}px`);
    this.renderer.setStyle(line, 'width', `${length}px`);
    this.renderer.setStyle(line, 'height', '2px');
    this.renderer.setStyle(line, 'background', 'transparent');
    this.renderer.setStyle(line, 'transform-origin', '0 0');
    this.renderer.setStyle(line, 'transform', `rotate(${angle}deg)`);
    this.renderer.setStyle(line, 'z-index', '1');
    
    // Add dotted line effect
    this.renderer.setStyle(line, 'background-image', 'linear-gradient(to right, #b38cf7bb 50%, transparent 50%)');
    this.renderer.setStyle(line, 'background-size', '14px 1px');
    this.renderer.setStyle(line, 'background-repeat', 'repeat-x');
    
    // Add the line to the container
    lineContainer.appendChild(line);
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.positionHeart);
  }
}
