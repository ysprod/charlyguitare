import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Particle {
  left: number;
  delay: number;
  duration: number;
  size: number;
}

interface Star {
  top: number;
  left: number;
  delay: number;
}

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  etapedujeu: string = "0";
  pointdevies: number = 6;
  maxvies: number = 10;
  pointdebonus: number = 0;

   particles: Particle[] = [];
  stars: Star[] = [];


  constructor(private router: Router) { }

  

  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.generateParticles(40);
    this.generateStars(60);
    this.initTiltEffect();
  }

  valider(s: string): boolean { return this.etapedujeu == s; }

   private generateParticles(count: number): void {
    this.particles = Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 8,
      size: 2 + Math.random() * 4
    }));
  }

  private generateStars(count: number): void {
    this.stars = Array.from({ length: count }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 3
    }));
  }

  // 🎯 Effet tilt 3D sur les cartes de jeu (suit la souris)
  private initTiltEffect(): void {
    setTimeout(() => {
      const cards = document.querySelectorAll<HTMLElement>('.btn-game');
      cards.forEach(card => {
        card.addEventListener('mousemove', (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = ((y - centerY) / centerY) * -6;
          const rotateY = ((x - centerX) / centerX) * 6;
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
        });
      });
    }, 100);
  }

  // 🌊 Parallaxe douce sur le fond quand la souris bouge
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    const glows = document.querySelectorAll<HTMLElement>('.glow');
    glows.forEach((glow, i) => {
      const factor = (i + 1) * 0.4;
      glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  }


  onSelectLyko(): void { this.goToTictac(this.pointdevies, this.pointdebonus, "1"); }
  onSelectLykoduo(): void { this.goToTictacduo(this.pointdevies, this.pointdebonus, "1"); }
  onSelectBoubouni(): void { this.goToboubou(this.pointdevies, this.pointdebonus, "2"); }
  onSelectDeDeKronos(): void { this.goToKronos(this.pointdevies, this.pointdebonus, "3"); }

  goToTictac(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/tictac'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  goToTictacduo(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/tictacduo'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  goToKronos(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/kronos'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  goToboubou(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/cards'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }
}