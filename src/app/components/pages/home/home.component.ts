import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { StorageService } from 'src/app/services/storage.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

/**
 * Export Class
 */
export class HomeComponent implements OnInit {
  @ViewChild('uiWallet') uiWallet;
  @ViewChild('addNetwork') addNetwork;
  @ViewChild('addToken') addToken;
  public ethereum: any;
  public account: any = {};
  public ektaMainnet: boolean = false;
  public bscMainnet: boolean = false;
  public ethToken: boolean = false;
  public ethUSDTToken: boolean = false;
  public bscToken: boolean = false;
  public bscUSDTToken: boolean = false;
  public wektaToken: boolean = false;
  
  /**
   * constructor
   */
  constructor(
    private toastr: ToastrService,
    private accountService: AccountService,
    private storageService: StorageService
  ) { }

  /**
   * Initial Loader
   */
  ngOnInit(): void {
    this.ethereum = window['ethereum'];
    this.account = this.storageService.getItem('account') === null ? { address: "", network: "", chainId: "", provider: "" } : JSON.parse(this.storageService.getItem('account'));
    this.accountService.accountObserve.subscribe(response => {
      this.account = response;
    });

  }

  /**
   * Connect Wallet
   */
  connectWallet(){
      let account = { status: true };
      this.accountService.connectionStatus(account);
  }

  /**
   * Add Bsc Mainnet
   */
  addBscMainnet(){
    window['ethereum'].request({ 
     method: 'wallet_addEthereumChain',
     params: [{
     chainId: '0x38',
     chainName: 'Binance',
     nativeCurrency: {
         name: 'BNB',
         symbol: 'BNB',
         decimals: 18
     },
     rpcUrls: ['https://bsc-dataseed1.binance.org/'],
     blockExplorerUrls: ['https://bscscan.com/']
     }]
   })
     .then((success) => {
       this.toastr.success("Network Added Successfully");
       this.bscMainnet = true;
     })
     .catch((error) => {
       if (error.code === 4001){
         this.toastr.error('User rejected');
       }
       else{
         this.toastr.error("Something went wrong");
       } 
     });
   
 }
 
 /**
  * Add Ekta Mainet
  */
  addEktaMainet(){
    window['ethereum'].request({ 
      method: 'wallet_addEthereumChain',
      params: [{
      chainId: '0x7ca',
      chainName: 'EktaChain',
      nativeCurrency: {
          name: 'EktaChain',
          symbol: 'EKTA',
          decimals: 18
      },
      rpcUrls: ['https://main.ekta.io'],
      blockExplorerUrls: ['https://ektascan.io']
      }]
    })
    .then((success) => {
      this.toastr.success("Network Added Successfully");
      this.ektaMainnet = true;
    })
    .catch((error) => {
      if (error.code === 4001){
        this.toastr.error('User rejected');
      }
      else{
        this.toastr.error("Something went wrong");
      }
    });
  }
  
  /**
   * Add WEkta Token
   */
  async addWEktaToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x7ca'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x7ca'}]});
        setTimeout(()=>  this.importWektaToken(), 500)
      return;
    }
    else{
      this.importWektaToken();
    }
  }

  importWektaToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x01D173d4E3b88DB8871dcfc9EfB9693e73375A43',
         symbol: 'WEKTA',
         decimals: 18,
         image: environment.BASE_URL+'assets/images/roadmap/wekta.svg',
       },
     },
   })
   .then((success) => {
    this.wektaToken = true;
  })
   .catch((error) => {
    });
 }

 /**
  * Add Eth Token 
  */
  async addEthToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x1'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x1'}]});
        setTimeout(()=>  this.importEthToken(), 500)
      return;
    }
    else{
      this.importEthToken();
    }
  }
 
  /**
   * Add USDT Token 
   */
  async addUSDTToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x1'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x1'}]});
        setTimeout(()=>  this.importUSDTToken(), 500)
      return;
    }
    else{
      this.importUSDTToken();
    }
  }

  /**
   * Add Bsc USDT Token 
   */
  async addBscUSDTToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x38'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x38'}]});
        setTimeout(()=>  this.importBscUSDTToken(), 500)
      return;
    }
    else{
      this.importBscUSDTToken();
    }
  }

  /**
   * Add Bsc Token 
   */
  async addBscToken(){
    if(this.account.chainId == '' || this.account.chainId == undefined){
      let account = { status: true };
      this.accountService.connectionStatus(account);
    }
    else if(this.account.chainId != '0x38'){
      await window['ethereum'].request({ method: 'wallet_switchEthereumChain', params:[{chainId: '0x38'}]});
        setTimeout(()=>  this.importBscToken(), 500)
      return;
    }
    else{
      this.importBscToken();
    }
  }

  /**
   * Import Bsc Token
   */
  importBscToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x45808ce43eb2d7685ff0242631f0feb6f3d8701a',
         symbol: 'EKTAv2',
         decimals: 18,
         image: 'https://bscscan.com/token/images/ektaworld_32.png',
       },
     },
   })
   .then((success) => {
    this.bscToken = true;
  })
   .catch((error) => {
    });
 }

 /**
  * Import Eth Token 
  */
 importEthToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x2f75113b13D136F861d212Fa9b572F2C79Ac81C4',
         symbol: 'EKTA',
         decimals: 18,
         image: 'https://etherscan.io/token/images/ektav2_32.png',
       },
     },
   })
   .then((success) => {
    this.ethToken = true;
   })
   .catch((error) => {
    });
 }

 /**
  * Import USDT Token
  */
 importUSDTToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
         symbol: 'USDT',
         decimals: 18,
         image: 'https://raw.githubusercontent.com/MetaMask/contract-metadata/master/images/usdt.svg',
       },
     },
   })
   .then((success) => {
    this.ethUSDTToken = true;
   })
   .catch((error) => {
    });
 }
 
 /**
  * Import Bsc USDT Token
  */
 importBscUSDTToken(){
    window['ethereum'].request({
     method: 'wallet_watchAsset',
     params: {
       type: 'ERC20',
       options: {
         address: '0x55d398326f99059fF775485246999027B3197955',
         symbol: 'USDT',
         decimals: 18,
         image: 'https://raw.githubusercontent.com/MetaMask/contract-metadata/master/images/usdt.svg',
       },
     },
   })
   .then((success) => {
    this.bscUSDTToken = true;
   })
   .catch((error) => {
    });
 }

}
