import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Frontend display notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  read: boolean;
}

// Backend API notification interface
export interface BackendNotification {
  id?: string;
  userId: string;
  type: 'ORDER' | 'LIBRARY' | 'HOUSING' | 'EMAIL';
  subject: string;
  message: string;
  email?: string;
  timestamp: Date;
  read?: boolean;
  details?: {
    orderId?: string;
    restaurantName?: string;
    totalAmount?: number;
    bookTitle?: string;
    bookId?: string;
    roomNumber?: string;
    additionalInfo?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;
  
  // Store notifications in memory
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(private http: HttpClient) {
    // Load notifications from localStorage on startup
    this.loadNotificationsFromStorage();
    
    // Auto-refresh every 30 seconds
    interval(30000).subscribe(() => {
      // In a real app, fetch from backend
      // For now, we'll use localStorage
    });
  }

  /**
   * Add a new notification (called when order is placed)
   */
  addNotification(notification: Notification): void {
    if (!notification.id) {
      notification.id = this.generateId();
    }
    if (!notification.timestamp) {
      notification.timestamp = new Date();
    }
    notification.read = false;
    
    const currentNotifications = this.notificationsSubject.value;
    const updatedNotifications = [notification, ...currentNotifications];
    
    this.notificationsSubject.next(updatedNotifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
    
    // Show browser notification if permitted
    this.showBrowserNotification(notification);
  }

  /**
   * Get all notifications
   */
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Get unread count as Observable
   */
  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): Notification[] {
    return this.notificationsSubject.value.filter(n => !n.read);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notifications = this.notificationsSubject.value.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    const notifications = this.notificationsSubject.value.map(n => 
      ({ ...n, read: true })
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Delete a notification
   */
  deleteNotification(notificationId: string): void {
    const notifications = this.notificationsSubject.value.filter(n => 
      n.id !== notificationId
    );
    this.notificationsSubject.next(notifications);
    this.updateUnreadCount();
    this.saveNotificationsToStorage();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
    this.unreadCountSubject.next(0);
    localStorage.removeItem('eduka_notifications');
  }

  /**
   * Update unread count
   */
  private updateUnreadCount(): void {
    const unreadCount = this.notificationsSubject.value.filter(n => !n.read).length;
    this.unreadCountSubject.next(unreadCount);
  }

  /**
   * Save notifications to localStorage
   */
  private saveNotificationsToStorage(): void {
    const notifications = this.notificationsSubject.value;
    localStorage.setItem('eduka_notifications', JSON.stringify(notifications));
  }

  /**
   * Load notifications from localStorage
   */
  private loadNotificationsFromStorage(): void {
    const stored = localStorage.getItem('eduka_notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        this.notificationsSubject.next(notifications);
        this.updateUnreadCount();
      } catch (e) {
        console.error('Failed to load notifications from storage', e);
      }
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Show browser notification
   */
  private showBrowserNotification(notification: Notification): void {
    if ('Notification' in window && window.Notification.permission === 'granted') {
      const icon = this.getNotificationIcon(notification.type);
      new window.Notification(notification.title, {
        body: notification.message,
        icon: icon,
        tag: notification.id
      });
    }
  }

  /**
   * Request browser notification permission
   */
  requestNotificationPermission(): void {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }

  /**
   * Get icon for notification type
   */
  private getNotificationIcon(type: string): string {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✗';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '🔔';
    }
  }
}
