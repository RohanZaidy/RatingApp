import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

export interface Rating {
  id?: string;
  stars: number;
  name: string;
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/ratings';

  constructor(private http: HttpClient) { }

  
  getRatings(): Observable<Rating[]> {
    return from(this.getRatingsAsync());
  }

  
  postRating(rating: Rating): Observable<Rating> {
    return from(this.postRatingAsync(rating));
  }

  
  private async getRatingsAsync(): Promise<Rating[]> {
    try {
      const ratings = await this.http.get<Rating[]>(this.apiUrl).toPromise();
      console.log('Ratings fetched successfully:', ratings);
      return ratings || [];
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error; 
    }
  }

  
  private async postRatingAsync(rating: Rating): Promise<Rating> {
    try {
      const newRating = await this.http.post<Rating>(this.apiUrl, rating).toPromise();
      console.log('Rating posted successfully:', newRating);
      return newRating!;
    } catch (error) {
      console.error('Error posting rating:', error);
      throw error; 
    }
  }
}