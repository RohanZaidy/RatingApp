import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, Rating } from './services/api-service.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ratings: Rating[] = [];
  newRating: Rating = {
    stars: 0,
    name: '',
    comment: ''
  };
  
  hoveredStar: number = 0;
  isSubmitting: boolean = false;
  showSuccessMessage: boolean = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.apiService.getRatings().subscribe({
      next: (data) => {
        this.ratings = data;
      },
      error: (error) => {
        console.error('Error loading ratings:', error);
      }
    });
  }

  onStarClick(star: number): void {
    this.newRating.stars = star;
  }

  onStarHover(star: number): void {
    this.hoveredStar = star;
  }

  onStarLeave(): void {
    this.hoveredStar = 0;
  }

  getStarClass(star: number): string {
    if (this.hoveredStar > 0) {
      return star <= this.hoveredStar ? 'text-warning' : 'text-muted';
    }
    return star <= this.newRating.stars ? 'text-warning' : 'text-muted';
  }

  onSubmit(): void {
    if (this.newRating.stars === 0 || !this.newRating.name.trim() || !this.newRating.comment.trim()) {
      return;
    }

    this.isSubmitting = true;

    this.apiService.postRating(this.newRating).subscribe({
      next: (response) => {
        this.ratings.push(response);
        this.resetForm();
        this.showSuccessMessage = true;
        this.isSubmitting = false;
        
        
        setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (error) => {
        console.error('Error submitting rating:', error);
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.newRating = {
      stars: 0,
      name: '',
      comment: ''
    };
  }

  getStarsArray(count: number): number[] {
    return Array(count).fill(0).map((x, i) => i + 1);
  }

  getAverageRating(): number {
    if (this.ratings.length === 0) return 0;
    const total = this.ratings.reduce((sum, rating) => sum + rating.stars, 0);
    return Math.round((total / this.ratings.length) * 10) / 10;
  }
}