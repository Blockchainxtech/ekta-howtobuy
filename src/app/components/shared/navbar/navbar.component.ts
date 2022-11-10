import { Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';

// Set web3 and connector
let web3 = new Web3(window['ethereum']);
let connector = new WalletConnect({
  bridge: "https://bridge.walletconnect.org"
});

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

/**
 * Export Class
 */
export class NavbarComponent implements OnInit {
  ethereum: any;
  account: any = {};
  alertSuccess: boolean = true;
  connector: any;
  getChainIdInterval: any;
  currentUrl: any;
  currentUrl1: any;

  /**
   * constructor
   */
  constructor(
    private accountService: AccountService, 
    private storageService: StorageService
  ) { }

  /**
   * Initial Loader
   */
  ngOnInit(): void {
    this.account = this.storageService.getItem('account') === null ? { address: "", network: "", chainId: "", provider: "" } : JSON.parse(this.storageService.getItem('account'));
    this.setAccount(this.account.address, this.account.chainId, this.account.provider);
    if (this.account.provider === 'metamask') {
      this.ethereum = window['ethereum'];
      this.setAccount(this.ethereum.selectedAddress, this.ethereum.chainId, this.account.provider);
      this.metamastListener();
    } else if (this.account.provider === 'trustwallet') {
      this.connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org", // Required
      });
      this.wallectConnectListener();
    }
    this.getChainIdInterval =  setInterval(() => this.getChainId(), 500)
    this.accountService.connectionObserve.subscribe(response => {
      if(response.status){
       this.connectMetamask();
      }
    });
  }

  /**
   * Get Chain Id
   */
  getChainId = async () => {
    this.setNetwork(this.account.chainId);
  }
  
  /**
   * Connect Wallet
   */
  connectWallet = async () => {
    // Create a connector
    this.connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });
    // Check if connection is already established
    if (!this.connector.connected) {
      // create new session
      this.connector.createSession();
    }
    this.wallectConnectListener();
  }

  /**
   * Wallect Connect Listener
   */
  public wallectConnectListener() {
    // Subscribe to connection events
    this.connector.on("connect", (error, payload) => {
      window.location.reload();
      if (error) {
        throw error;
      }
      // Get provided accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.setAccount(accounts[0], chainId, 'trustwallet');
    });

    this.connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }
      // Get updated accounts and chainId
      const { accounts, chainId } = payload.params[0];
      this.setAccount(accounts[0], chainId, 'trustwallet');
    });

    this.connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }

      // Delete connector
      this.setAccount("", "", "");
    });
    this.alertSuccess = true;
  }

  /**
   * Connect Metamask
   */
  connectMetamask = async () => {
    this.ethereum = window['ethereum'];
    const accounts = await this.ethereum.request({ method: 'eth_requestAccounts' });
    this.setAccount(accounts[0], this.ethereum.chainId, 'metamask');
    this.metamastListener();
  }

  /**
   * Metamast Listener
   */
  public metamastListener() {
    // Listener
    this.ethereum.on('accountsChanged', (accounts) => {
      this.setAccount(accounts[0], this.ethereum.chainId, 'metamask');
    });
    this.ethereum.on('chainChanged', (chainId) => {
      this.setAccount(this.account.address, chainId, 'metamask');
    });
    this.ethereum.on('close', (chainId) => {
      this.setAccount("", "", '');
    });
    this.alertSuccess = true;
    this.storageService.setItem("walletconnect","");
  }

  
  /**
   * Store account details
   * @param {string} address 
   * @param {string} chainId 
   * @param {string} provider 
   */
  public async setAccount(address, chainId, provider) {
    let account;
    if (address != "" && address != undefined) {
      const {network, key} = this.setNetwork(chainId);
      account = { address: address, chainId: chainId, network, key, provider: provider  }
    } else {
      account = { address: "", network: "", chainId: "", provider: "", key: "" };
    }
    this.accountService.setAccount(account);
    this.account = Object.assign({}, account);
    this.storageService.setItem('account', JSON.stringify(this.account));
  }

  /**
  * Network Details
  * @param {string} chainId 
  * @returns 
  */
   public setNetwork(chainId) {
    let network;
    let key;
    switch (chainId) {
      case '0x1':
      case 1:
        network = "ETH Mainnet";
        key =  "ETH";
        break;
      case '0x3':
      case 3:
        network = "Ropsten";
        key = "EKTA";
        break;
      case '0x4':
      case 4:
        network = "Rinkeby";
        key = "ETH";
        break;
      case '0x38':
      case 56:
        network = 'BSC Mainnet';
        key = "BSC";
        break;
      case '0x61':
      case 97:
        network = 'BSC Testnet';
        key = "BSC";
        break;
      case '0x3ec':
      case 1004:
        network = 'EktaChain Testnet';
        key = "EKTA";
        break;
      case '0x7ca':
      case 1994:
        network = 'EktaChain';
        key = "EKTA";
        break;
      default:
        network = 'Unknown';
        break;
    }
    return {network, key};
  }

  /**
   * Disconnect
   */
  disconnect(){
    this.storageService.setItem('walletconnect', "");
    this.setAccount("", "", "");
  }
  
}



