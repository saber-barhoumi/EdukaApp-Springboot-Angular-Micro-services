import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isOpen: boolean = false;
  
  private notificationsSubscription?: Subscription;
  private unreadCountSubscription?: Subscription;

  constructor(public notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.notificationsSubscription = this.notificationService.notifications$.subscribe(
      notifications => {
        this.notifications = notifications;
      }
    );

    // Subscribe to unread count
    this.unreadCountSubscription = this.notificationService.unreadCount$.subscribe(
      count => {
        this.unreadCount = count;
      }
    );

    // Request notification permission
    this.notificationService.requestNotificationPermission();
  }

  ngOnDestroy(): void {
    this.notificationsSubscription?.unsubscribe();
    this.unreadCountSubscription?.unsubscribe();
  }

  /**
   * Toggle notification panel
   */
  togglePanel(): void {
    this.isOpen = !this.isOpen;
  }

  /**
   * Close panel
   */
  closePanel(): void {
    this.isOpen = false;
  }

  /**
   * Handle notification click
   */
  onNotificationClick(notification: Notification): void {
    if (!notification.read && notification.id) {
      this.notificationService.markAsRead(notification.id);
    }
  }

  /**
   * Delete notification
   */
  deleteNotification(event: Event, notificationId: string | undefined): void {
    event.stopPropagation();
    if (notificationId) {
      this.notificationService.deleteNotification(notificationId);
    }
  }

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    if (confirm('Are you sure you want to clear all notifications?')) {
      this.notificationService.clearAll();
    }
  }

  /**
   * Get time ago string
   */
  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffMs = now.getTime() - notifTime.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return notifTime.toLocaleDateString();
  }

  /**
   * Get notification icon
   */
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'ORDER': return '🍽️';
      case 'LIBRARY': return '📚';
      case 'HOUSING': return '🏠';
      case 'EMAIL': return '✉️';
      default: return '🔔';
    }
  }
}
