import { Component } from '@angular/core';

@Component({
  selector: 'app-comming-soon',
  templateUrl: './comming-soon.component.html',
  styleUrl: './comming-soon.component.scss'
})
export class CommingSoonComponent {
launchDate: Date = new Date('2025-12-31T00:00:00');
  timeLeft: any = {};
  timerInterval: any;
  email: string = '';
  message: string = '';

  constructor() {}

  ngOnInit() {
    this.calculateTimeLeft();
    this.startCountdown();
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  calculateTimeLeft() {
    const difference = +this.launchDate - +new Date();
    if (difference > 0) {
      this.timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      this.timeLeft = {};
    }
  }

  startCountdown() {
    this.timerInterval = setInterval(() => {
      this.calculateTimeLeft();
    }, 1000);
  }

  handleSubmit() {
    this.message = 'Thank you for subscribing!';
    this.email = '';
  }
}
