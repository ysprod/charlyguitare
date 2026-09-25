import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TictactoeserviceService } from '../../services/tictactoeservice.service';

@Component({
  selector: 'app-tictactoe',
  templateUrl: './tictactoe.component.html',
  styleUrls: ['./tictactoe.component.css']
})
export class TictactoeComponent implements OnInit {

  lock = false;
  rejouer = false;
  etapedujeu: string = "0";
  lavie: number = 0;
  lebonus: number = 0;
  pointdevies: number = 0;
  pointdebonus: number = 0;
  messageLyko: string = "Lyko le Sage observe votre stratégie...";
  showConfetti = false;
  showVictoryOverlay = false;
  showDefeatOverlay = false;
  particles: number[] = [];

  /** PV gagnés par alignement (règle : 10 PV par alignement, quel que soit le niveau) */
  readonly ALIGNMENT_REWARD = 10;

  private audioCtx?: AudioContext;

  constructor(
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public gs: TictactoeserviceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const vieParam = this.activatedRoute.snapshot.queryParamMap.get('vie');
    const bonusParam = this.activatedRoute.snapshot.queryParamMap.get('bonus');

    this.lavie = parseInt(vieParam || '500', 10);
    this.lebonus = parseInt(bonusParam || '0', 10);
    this.etapedujeu = this.activatedRoute.snapshot.queryParamMap.get('etape') || this.etapedujeu;

    this.pointdevies = this.lavie;
    this.pointdebonus = this.lebonus;

    this.initAudio();
    this.resetjeu();
  }

  private initAudio(): void {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) this.audioCtx = new AudioContextClass();
  }

  private playSound(type: 'click' | 'win' | 'lose' | 'draw' | 'levelup' | 'bot'): void {
    if (!this.audioCtx) return;
    if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    const now = this.audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06);
      osc.start(now); osc.stop(now + 0.06);
    } else if (type === 'bot') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.15);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now); osc.stop(now + 0.15);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const o = this.audioCtx!.createOscillator();
        const g = this.audioCtx!.createGain();
        o.type = 'triangle';
        o.connect(g); g.connect(this.audioCtx!.destination);
        o.frequency.setValueAtTime(freq, now + idx * 0.1);
        g.gain.setValueAtTime(0.2, now + idx * 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.3);
        o.start(now + idx * 0.1); o.stop(now + idx * 0.1 + 0.3);
      });
    } else if (type === 'lose') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.4);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start(now); osc.stop(now + 0.4);
    } else if (type === 'draw') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'levelup') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.5);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now); osc.stop(now + 0.5);
    }
  }

  resetjeu(): void {
    this.rejouer = false;
    this.lock = false;
    this.showConfetti = false;
    this.showVictoryOverlay = false;
    this.showDefeatOverlay = false;
    this.gs.resetAll();
    this.gs.turn = 0;

    // Remise à zéro des scores d'alignements de la manche
    this.gs.players[0].score = 0;
    this.gs.players[1].score = 0;

    this.messageLyko = `Niveau ${this.gs.gridSize - 2} : Grille ${this.gs.gridSize}x${this.gs.gridSize} — Alignez ${this.gs.winningStreak} pions pour gagner +${this.ALIGNMENT_REWARD} PV !`;
  }

  prochainNiveau(): void {
    this.playSound('levelup');
    this.gs.nextLevel();
    this.resetjeu();
    this.snackBar.open(`🚀 Niveau Supérieur ! Grille ${this.gs.gridSize}x${this.gs.gridSize} !`, "Sensationnel !", { duration: 3000 });
  }

  
playerClick(i: number): void {
  if (this.gs.blocks[i].free === false || this.lock) return;

  this.playSound('click');
  this.gs.blocks[i].free = false;
  this.gs.freeBlocksRemaining -= 1;
  this.gs.blocks[i].setValue(this.gs.turn === 0 ? "tick" : "cross");

  // ✅ Détecte si le coup a formé un ou plusieurs nouveaux alignements de 3 pions
  const newAlignments = this.gs.checkNewAlignments();
  if (newAlignments > 0) {
    this.handleAlignment(this.gs.turn, newAlignments);
  }

  // ⚠️ Le jeu s'arrête UNIQUEMENT quand toutes les cases sont remplies
  if (this.gs.freeBlocksRemaining <= 0) {
    setTimeout(() => this.handleDraw(), 600);
    return;
  }

  this.changeTurn();
}

/** Un ou plusieurs alignements détectés (+10 PV par alignement) */
private handleAlignment(playerTurn: number, count: number): void {
  const gain = count * this.ALIGNMENT_REWARD;
  
  // Seul le Joueur (index 0) gagne des PV cumulables dans la partie globale
  if (playerTurn === 0) {
    this.pointdevies += gain;
    this.lavie = this.pointdevies;
  }
  
  // On crédite les alignements au score du joueur
  this.gs.players[playerTurn].score += count;

  this.playSound('win');

  const joueur = playerTurn === 0 ? "🎸 VOUS" : "🐵 LYKÖ LE SAGE";
  this.messageLyko = `✨ ${count} alignement(s) de 3 par ${joueur} ! +${gain} PV !`;

  this.snackBar.open(`🎯 ${count} alignement(s) ${joueur} : +${gain} PV`, "Super !", { duration: 2000 });

  setTimeout(() => this.gs.clearWinningHighlight(), 1200);
}

  /** Un alignement détecté : +10 PV, mise en avant visuelle, la partie continue. */
  

  /** Fin de manche : grille pleine. On compare les scores d'alignements. */
  private handleDraw(): void {
    if (this.lock) return;
    this.lock = true;
    this.rejouer = true;
    this.gs.draw += 1;
    this.playSound('draw');

    const scoreVous = this.gs.players[0].score;
    const scoreLyko = this.gs.players[1].score;

    if (scoreVous > scoreLyko) {
      this.triggerConfetti();
      this.showVictoryOverlay = true;
      this.messageLyko = `🏆 Grille terminée ! Vous remportez le duel (${scoreVous} - ${scoreLyko}) !`;
      this.snackBar.open(`🏆 VICTOIRE ${scoreVous} - ${scoreLyko} !`, "Bravo !", { duration: 3500 });
    } else if (scoreLyko > scoreVous) {
      this.showDefeatOverlay = true;
      this.messageLyko = `💀 Grille terminée ! Lykö le Sage l'emporte (${scoreLyko} - ${scoreVous}).`;
      this.snackBar.open(`💀 DÉFAITE ${scoreLyko} - ${scoreVous}`, "Revenger !", { duration: 3000 });
    } else {
      this.messageLyko = `⚖️ Grille terminée ! Égalité parfaite (${scoreVous} - ${scoreLyko}).`;
      this.snackBar.open(`⚖️ MATCH NUL ${scoreVous} - ${scoreLyko}`, "Égalité", { duration: 3000 });
    }
  }

  private triggerConfetti() {
    this.showConfetti = true;
    this.particles = Array.from({ length: 60 }, (_, i) => i);
    setTimeout(() => {
      this.showConfetti = false;
      this.showVictoryOverlay = false;
    }, 4500);
  }

  private changeTurn(): void {
    const current = this.gs.changeTurn();
    if (current === 1) {
      this.gs.isBotThinking = true;
      this.messageLyko = "🔮 Lyko Le Sage prépare son sortilège...";
      setTimeout(() => {
        this.gs.isBotThinking = false;
        this.botTurn();
      }, 700);
    } else {
      this.messageLyko = "🎯 À votre tour d'invoquer une Charly Guitare.";
    }
  }

  private botTurn(): void {
    if (this.gs.freeBlocksRemaining <= 0 || this.lock) return;
    const botIndex = this.gs.figureBotMove();
    if (botIndex >= 0 && this.gs.blocks[botIndex].free) {
      this.playSound('bot');
      this.playerClick(botIndex);
    }
  }

  incrementervie(): void {
    this.pointdevies += 500 * (this.gs.gridSize - 2);
    this.lavie = this.pointdevies;
  }

  goToPlay(lavie: number, lebonus: number, letape: string): void {
    this.router.navigate(['/play'], { queryParams: { vie: lavie, bonus: lebonus, etape: letape } });
  }

  onrecommencer(): void {
    this.goToPlay(this.lavie, this.lebonus, this.etapedujeu);
  }

  onrecommencerdeux(): void {
    this.router.navigate(['/play'], {
      queryParams: { vie: this.lavie, bonus: this.lebonus, etape: this.etapedujeu }
    });
  }

  gagnant(): boolean { return this.gs.players[0].score > 0; }
  casuffit(): boolean { return this.pointdevies >= 10000000000; }
 }