package com.ski.eduka.service;

import com.ski.eduka.client.NotificationMessageDTO;
import com.ski.eduka.client.NotificationServiceClient;
import com.ski.eduka.entity.Book;
import com.ski.eduka.repository.BookRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
@Slf4j
public class BookService {
    
    @Autowired
    private BookRepository bookRepository;
    
    @Autowired
    private NotificationServiceClient notificationServiceClient;
    
    /**
     * Borrow a book and send notification
     */
    public Book borrowBook(Long bookId, String userId, String userEmail) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        if (!book.getIsAvailable() || book.getAvailableCopies() <= 0) {
            throw new RuntimeException("Book is not available for borrowing");
        }
        
        // Update book availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        if (book.getAvailableCopies() == 0) {
            book.setIsAvailable(false);
        }
        book.setUpdatedAt(LocalDateTime.now());
        
        Book savedBook = bookRepository.save(book);
        
        // 🔥 FEIGN CLIENT COMMUNICATION #2: Library → Notification Service
        sendBookBorrowNotification(savedBook, userId, userEmail);
        
        return savedBook;
    }
    
    /**
     * Send notification when a book is borrowed using Feign Client
     */
    private void sendBookBorrowNotification(Book book, String userId, String userEmail) {
        try {
            NotificationMessageDTO notification = new NotificationMessageDTO();
            notification.setUserId(userId);
            notification.setType("LIBRARY");
            notification.setSubject("Book Borrowed Successfully");
            notification.setMessage("You have successfully borrowed: " + book.getTitle());
            notification.setEmail(userEmail);
            notification.setTimestamp(LocalDateTime.now());
            
            NotificationMessageDTO.NotificationDetails details = 
                new NotificationMessageDTO.NotificationDetails();
            details.setBookId(book.getId().toString());
            details.setBookTitle(book.getTitle());
            details.setAdditionalInfo("Author: " + book.getAuthor() + " | ISBN: " + book.getIsbn());
            notification.setDetails(details);
            
            // Call Notification Service via Feign Client
            notificationServiceClient.sendNotification(notification);
            log.info("✅ Book borrow notification sent via Feign Client for book: {} to user: {}", 
                     book.getTitle(), userId);
            
        } catch (Exception e) {
            log.error("❌ Failed to send book borrow notification: {}", e.getMessage());
            // Don't fail the book borrowing if notification fails
        }
    }
    
    /**
     * Return a book
     */
    public Book returnBook(Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + bookId));
        
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        book.setIsAvailable(true);
        book.setUpdatedAt(LocalDateTime.now());
        
        return bookRepository.save(book);
    }
    
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    public List<Book> getAvailableBooks() {
        return bookRepository.findByIsAvailableTrue();
    }
    
    public Book getBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }
}
