import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, throwError } from 'rxjs';
import { map, catchError, retry, switchMap } from 'rxjs/operators';

export interface Agent {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  specialization: string;
  responseTime: string;
  rating: number;
  totalChats: number;
  isActive: boolean;
  lastSeen?: Date;
  department?: string;
  languages?: string[];
  maxConcurrentChats?: number;
  currentChatCount?: number;
  isAvailable?: boolean;
}

export interface ChatSession {
  sessionId: string;
  agent: Agent;
  startTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private readonly apiUrl = 'http://localhost:8082/api/agents';
  
  private agentsSubject = new BehaviorSubject<Agent[]>([]);
  private selectedAgentSubject = new BehaviorSubject<Agent | null>(null);
  
  constructor(private http: HttpClient) {
    this.loadInitialAgents();
    this.startRealTimeUpdates();
  }

  getAgents(): Observable<Agent[]> {
    return this.agentsSubject.asObservable();
  }

  getSelectedAgent(): Observable<Agent | null> {
    return this.selectedAgentSubject.asObservable();
  }

  // Load agents from backend
  loadAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}`).pipe(
      map(agents => agents.map(this.transformAgent)),
      catchError(this.handleError)
    );
  }

  getOnlineAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/online`).pipe(
      map(agents => agents.map(this.transformAgent)),
      catchError(this.handleError)
    );
  }

  getAvailableAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/available`).pipe(
      map(agents => agents.map(this.transformAgent)),
      catchError(this.handleError)
    );
  }

  getAgentById(id: number): Observable<Agent> {
    return this.http.get<Agent>(`${this.apiUrl}/${id}`).pipe(
      map(this.transformAgent),
      catchError(this.handleError)
    );
  }

  getAgentsBySpecialization(specialization: string): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/specialization/${specialization}`).pipe(
      map(agents => agents.map(this.transformAgent)),
      catchError(this.handleError)
    );
  }

  getAgentsByLanguage(language: string): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/language/${language}`).pipe(
      map(agents => agents.map(this.transformAgent)),
      catchError(this.handleError)
    );
  }

  updateAgentStatus(agentId: number, status: Agent['status']): Observable<Agent> {
    return this.http.put<Agent>(`${this.apiUrl}/${agentId}/status`, { status }).pipe(
      map(this.transformAgent),
      catchError(this.handleError)
    );
  }

  // Start chat session with agent
  async startChatWithAgent(agentId: number): Promise<ChatSession> {
    try {
      const agent = await this.http.post<Agent>(`${this.apiUrl}/${agentId}/assign-chat`, {}).pipe(
        map(this.transformAgent),
        retry(1)
      ).toPromise();

      if (!agent) {
        throw new Error('Failed to assign agent');
      }

      const sessionId = `chat_${Date.now()}_${agentId}`;
      const session: ChatSession = {
        sessionId,
        agent,
        startTime: new Date()
      };

      // Update selected agent
      this.selectedAgentSubject.next(agent);
      
      // Refresh agents list to show updated status
      this.refreshAgents();

      return session;
    } catch (error) {
      console.error('Error starting chat with agent:', error);
      throw new Error('Agent is not available for chat');
    }
  }

  // End chat session
  async endChatSession(agentId: number): Promise<void> {
    try {
      await this.http.post(`${this.apiUrl}/${agentId}/release-chat`, {}).toPromise();
      this.refreshAgents();
    } catch (error) {
      console.error('Error ending chat session:', error);
    }
  }

  // Rate agent after chat
  rateAgent(agentId: number, rating: number): Observable<void> {
    if (rating < 1 || rating > 5) {
      return throwError(() => new Error('Rating must be between 1 and 5'));
    }

    return this.http.put<void>(`${this.apiUrl}/${agentId}/rating`, { rating }).pipe(
      catchError(this.handleError)
    );
  }

  // Get online agent count
  getOnlineAgentCount(): Observable<number> {
    return this.http.get<{onlineCount: number}>(`${this.apiUrl}/stats/online-count`).pipe(
      map(response => response.onlineCount),
      catchError(this.handleError)
    );
  }

  // Get agents sorted by availability and performance
  getAvailableAgentsSorted(): Observable<Agent[]> {
    return this.getAvailableAgents().pipe(
      map(agents => {
        return agents.sort((a, b) => {
          // Priority: online > away > busy > offline
          const statusPriority = { online: 4, away: 3, busy: 2, offline: 1 };
          const priorityDiff = statusPriority[b.status] - statusPriority[a.status];
          
          if (priorityDiff !== 0) return priorityDiff;
          
          // Secondary sort by rating
          return (b.rating || 0) - (a.rating || 0);
        });
      })
    );
  }

  // Search agents by name or specialization
  searchAgents(query: string): Observable<Agent[]> {
    return this.agentsSubject.pipe(
      map(agents => agents.filter(agent => 
        agent.name.toLowerCase().includes(query.toLowerCase()) ||
        agent.specialization.toLowerCase().includes(query.toLowerCase()) ||
        agent.department?.toLowerCase().includes(query.toLowerCase())
      ))
    );
  }

  // Private methods
  private loadInitialAgents(): void {
    this.loadAgents().subscribe({
      next: (agents) => {
        this.agentsSubject.next(agents);
        
        // Set default selected agent
        if (agents.length > 0 && !this.selectedAgentSubject.value) {
          const onlineAgent = agents.find(agent => agent.status === 'online');
          this.selectedAgentSubject.next(onlineAgent || agents[0]);
        }
      },
      error: (error) => {
        console.error('Failed to load initial agents:', error);
        // Fallback to mock data if backend is not available
        this.loadMockAgents();
      }
    });
  }

  private startRealTimeUpdates(): void {
    // Refresh agents every 30 seconds
    interval(30000).subscribe(() => {
      this.refreshAgents();
    });
  }

  private refreshAgents(): void {
    this.loadAgents().subscribe({
      next: (agents) => {
        this.agentsSubject.next(agents);
        
        // Update selected agent if it exists in the new list
        const currentSelected = this.selectedAgentSubject.value;
        if (currentSelected) {
          const updatedAgent = agents.find(a => a.id === currentSelected.id);
          if (updatedAgent) {
            this.selectedAgentSubject.next(updatedAgent);
          }
        }
      },
      error: (error) => {
        console.error('Failed to refresh agents:', error);
      }
    });
  }

  private transformAgent = (agent: any): Agent => {
    return {
      id: agent.id,
      name: agent.name,
      email: agent.email,
      avatarUrl: agent.avatarUrl || agent.avatar,
      status: agent.status.toLowerCase() as Agent['status'],
      specialization: agent.specialization,
      responseTime: agent.responseTime,
      rating: agent.rating || 0,
      totalChats: agent.totalChats || 0,
      isActive: agent.isActive !== false,
      lastSeen: agent.lastSeen ? new Date(agent.lastSeen) : undefined,
      department: agent.department,
      languages: agent.languages,
      maxConcurrentChats: agent.maxConcurrentChats,
      currentChatCount: agent.currentChatCount,
      isAvailable: agent.isAvailable
    };
  };

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);
    
    if (error.status === 0) {
      // Network error
      console.error('Network error - backend may be down');
    } else if (error.status >= 500) {
      // Server error
      console.error('Server error:', error.message);
    } else {
      // Client error
      console.error('Client error:', error.message);
    }
    
    return throwError(() => new Error(error.message || 'Something went wrong'));
  };

  private loadMockAgents(): void {
    // Fallback mock data if backend is not available
    const mockAgents: Agent[] = [
      {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah@eduka.com',
        avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg',
        status: 'online',
        specialization: 'General Support',
        responseTime: '< 2 min',
        rating: 4.9,
        totalChats: 1247,
        isActive: true
      },
      {
        id: 2,
        name: 'Mike Chen',
        email: 'mike@eduka.com',
        avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg',
        status: 'online',
        specialization: 'Technical Support',
        responseTime: '< 3 min',
        rating: 4.8,
        totalChats: 892,
        isActive: true
      }
    ];
    
    this.agentsSubject.next(mockAgents);
    this.selectedAgentSubject.next(mockAgents[0]);
  }
}
