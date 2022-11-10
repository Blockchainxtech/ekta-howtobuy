import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';

let apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public account;
  public register;
  public connection;

  public accountObserve: Observable<{
    address: string,
    chainId: string,
    network: string
  }>;
  public connectionObserve: Observable<{
    status: boolean;
  }>;

  constructor(private http: HttpClient) {
    this.account = new BehaviorSubject({
      address: '',
      chainId: '',
      network: ''
    });
    this.accountObserve = this.account.asObservable();
    
    this.connection = new BehaviorSubject({
      status: false
    });
    this.connectionObserve = this.connection.asObservable();
  }

  setAccount(data: {
    address: string,
    chainId: string,
    network: string
  }) {
    this.account.next(data);
  }

  connectionStatus(connectionStatus: {
    status: boolean
  }) {
    this.connection.next(connectionStatus);
  }
}
