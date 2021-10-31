import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import Web3 from "web3";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { Spinner } from "react-bootstrap";

import ipfs from "./ipfs";
import MyNavbar from "./components/MyNavbar";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import AddContent from "./components/AddContent";
import Profile from "./components/Profile";
import Content from "./components/Content";

class App extends Component {

  constructor(props) {

    super(props)

    this.state = {

      accounts: null,
      show:false,
      creatorProfile: null,
      username: null,
      web3: null,
      contract: null,
      isLogged: false,
      userAccount: null,
      loading: true,
      totalContent: [],
      allContent: [],
      projectContent: [],
      articleContent: [],
      paperContent: [],
      userAllContent: [],
      userProjectContent: [],
      userArticleContent: [],
      userPaperContent: [],
      userRemovedContent: [],
      buffer: null,
      ipfsHash: null

    }

    this.child = React.createRef();
    this.loadStorage = this.loadStorage.bind(this);
    this.stopLoading = this.stopLoading.bind(this);
    this.loadContract = this.loadContract.bind(this);
    this.loadContent = this.loadContent.bind(this);
    this.loadWeb3 = this.loadWeb3.bind(this);
    this.getAccounts = this.getAccounts.bind(this);
    this.createUser = this.createUser.bind(this);
    this.setSelectedOption = this.setSelectedOption.bind(this);
    this.captureFile = this.captureFile.bind(this);
    this.deleteContent = this.deleteContent.bind(this);
    this.restoreContent = this.restoreContent.bind(this);
    this.updateContract = this.updateContract.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.logout = this.logout.bind(this);

  }

  componentDidMount = async () => {
    try {

      this.setState({ loading:true });

      await this.loadWeb3();
      await this.loadContract();
      await this.loadStorage();
      await this.loadContent();
      await this.getAccounts();

      this.setState({ loading:false });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  loadWeb3 = async () => {

    this.setState({ loading: true });

    const web3 = new Web3("http://192.168.29.217:7545");
    console.log("web3 ready");

    this.setState({ web3, loading: false });

  };

  loadContract = async () => {

    this.setState({ loading: true });

    const { web3 } = this.state;

    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SimpleStorageContract.networks[networkId];
    const instance = new web3.eth.Contract(
      SimpleStorageContract.abi,
      deployedNetwork && deployedNetwork.address,
    );

    this.setState({ contract: instance, loading: false });

  };

  loadStorage = async () => {

    this.setState({ loading: true });

    const username = await localStorage.getItem( 'username' ) || 1;
    const userAccount = await localStorage.getItem( 'userAccount' ) || 1;
    const isLogged = await localStorage.getItem( 'isLogged' ) || 1;

    await this.setState({username: isLogged ? username : null,
      userAccount: isLogged ? userAccount : null,
      isLogged:isLogged });

  
    this.setState({ loading: false });

  };

  loadContent = async () => {

    this.setState({ loading: true });
    this.setState({ totalContent: [], allContent: [], projectContent:[], paperContent:[], articleContent:[] });

    const { contract } = this.state;

    const contentCount = await contract.methods.contentCount().call();

    for (var i = 0; i < contentCount; i++) {

      //const content = await contract.methods.getContent(i+1).call();
      const content = await contract.methods.content(i+1).call();

      this.state.totalContent.push(content);

      if (content.isRemoved) {
        continue;
      }

      this.state.allContent.push(content);
      //console.log(content.contentType);
      if (content.contentType === 'Project') {
        this.state.projectContent.push(content);
      }else if (content.contentType === 'Article') {
        this.state.articleContent.push(content);
      }else if (content.contentType === 'Paper') {
        this.state.paperContent.push(content);
      }

    }

    if(this.state.userAccount!=null){

      this.setState({ userRemovedContent: [], userAllContent: [], userPaperContent:[], userProjectContent:[], userArticleContent:[] });
      this.loadCreatorProfile();

    }

    this.setState({ loading: false });

  };

  loadCreatorProfile = async () => {

    this.setState({ loading: true });

    const creatorProfile = await this.state.contract.methods.getCreator(this.state.userAccount).call();
    const creatorContentId = creatorProfile.creatorContentId;

    for (var i = 0; i < creatorContentId.length; i++) {
      const allId = creatorContentId[i] - 1;

      if (this.state.totalContent[allId].isRemoved) {
        this.state.userRemovedContent.push(this.state.totalContent[allId]);
        continue;
      }

      this.state.userAllContent.push(this.state.totalContent[allId]);
      if (this.state.totalContent[allId].contentType === 'Project') {
        this.state.userProjectContent.push(this.state.totalContent[allId]);
      }else if (this.state.totalContent[allId].contentType === 'Article') {
        this.state.userArticleContent.push(this.state.totalContent[allId]);
      }else if (this.state.totalContent[allId].contentType === 'Paper') {
        this.state.userPaperContent.push(this.state.totalContent[allId]);
      }
    }

    this.setState({ loading: false });

  };

  getAccounts = async () => {

    this.setState({ loading:true });

    const accounts = await this.state.web3.eth.getAccounts();

    this.setState({ accounts, loading:false });

  };

  createUser = async (username,password) => {
    try {

      this.setState({ loading: true });

      const { web3, accounts } = this.state;

      const userAccount = await web3.eth.accounts.create();
      await web3.eth.personal.importRawKey(userAccount.privateKey, password);
      await web3.eth.personal.unlockAccount(userAccount.address, password);

      const twallet = await web3.eth.accounts.wallet.create(0);
      await twallet.add(userAccount.privateKey);
      await twallet.save(password, username);
      console.log("created user account", twallet[0].address);

      await web3.eth.getBalance(accounts[1], (err, bal) => { console.log("Ganache balance", bal); } );
      await web3.eth.sendTransaction({to:userAccount.address, from:accounts[1], value:web3.utils.toWei("1", "ether")});
      await web3.eth.getBalance(userAccount.address, (err, bal) => { console.log("New Account balance", bal); } );

      await this.setSelectedOption(userAccount.address, username, true);
      this.getAccounts();

      this.setState({ userAccount: userAccount.address, username, isLogged: true, loading: false });

    } catch(error) {
      console.error(error);
    }
  };

  loadUser = async (username,password) => {
    try {

      this.setState({ loading: true });

      const { web3, contract } = this.state;

      const localWallet = await web3.eth.accounts.wallet.load(password, username);
      console.log("local wallet address", localWallet[0].address);
      console.log('privateKey', localWallet[0].privateKey);
      await web3.eth.personal.importRawKey(localWallet[0].privateKey, password);
      await web3.eth.personal.unlockAccount(localWallet[0].address, password);
      await this.setSelectedOption(localWallet[0].address, username, true);

      const creatorProfile = await contract.methods.getCreator(localWallet[0].address).call();

      await this.setState({ creatorProfile: creatorProfile });
      await this.loadCreatorProfile();
      await this.setState({ loading: true, show: false });
      var promise = new Promise(function(resolve, reject) {
        resolve(true);
      });
      return promise;

    } catch(error) {
      this.setState({ loading: true, show: true });
      var promise = new Promise(function(resolve, reject) {
        resolve(false);
      });
      return promise;
    }
  };

  stopLoading = async () => {
    this.setState({loading: false});
  };

  setSelectedOption = async ( localWallet, username, isLogged ) => {
      localStorage.setItem( 'userAccount', localWallet );
      localStorage.setItem( 'username', username );
      localStorage.setItem( 'isLogged', isLogged );
      console.log(isLogged);
      console.log(false);
      await this.setState({ userAccount: localWallet, username, isLogged : isLogged });
      console.log('from local storage', localStorage.getItem(isLogged));
      //this.setState( { selectedOption: option } );
  }

  logout = async () => {
    try {

      this.setState({ loading: true });

      await this.setSelectedOption(null, null, false);
      this.setState({ web3: null });
      await this.loadWeb3();

      this.setState({creatorProfile:[], userAllContent: [], userProjectContent: [], userArticleContent: [], userPaperContent: [], userRemovedContent: [] });

      this.setState({ loading: false });

    } catch(error) {
      console.error(error);
    }
  };

  captureFile = async (file) => {

    const reader = new window.FileReader()
    await reader.readAsArrayBuffer(file)
    reader.onloadend = async () => {
      await this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }

  };

  deleteContent = async (id, contentHash, title, author) => {
    try {

      this.setState({ loading: true });

      console.log(id, contentHash, title);
      const { contract, userAccount } = this.state;

      if(userAccount === author){
        contract.methods.deleteContent(id, contentHash, title)
          .send({ from: userAccount, gas: 6721975 })
          .then((r) => {
            console.log('Removed content')
            this.loadContent();
            this.setState({ loading: false });
          })
      } else {

        this.setState({ loading: false });
        alert(`unauthorised user`);

      }

    } catch(error) {
      console.error(error);
    }
  };

  restoreContent = async (id, contentHash, title, author) => {
    try {

      this.setState({ loading: true });

      console.log(id, contentHash, title);
      const { contract, userAccount } = this.state;

      if(userAccount === author){
        contract.methods.restoreContent(id, contentHash, title)
          .send({ from: userAccount, gas: 6721975 })
          .then((r) => {
            console.log('Removed content')
            this.loadContent();
            this.setState({ loading: false });
          })
      } else {

        this.setState({ loading: false });
        alert(
          `unauthorised user`,
        );

      }

    } catch(error) {
      console.error(error);
    }
  };

  updateContract = async (title, description, type, file) => {
    try {

      this.setState({ loading: true });

      console.log(title, description, type, file);
      const { contract, userAccount, username } = this.state;

      await ipfs.files.add(this.state.buffer, (error, result) => {
        if(error) {
          console.error(error)
          return
        }
        contract.methods.addContent(username, type, result[0].hash, description, title)
                        .send({ from: userAccount, gas: 6721975 })
                        .then((r) => {
                            this.setState({ ipfsHash: result[0].hash })
                            console.log('ifpsHash', this.state.ipfsHash)
                            this.loadContent()
                            this.setState({ loading: false })
                        })
      })


      console.log(this.state.buffer);
      console.log(this.state.ipfsHash);
      console.log(contract.methods.creator(userAccount).call());





    } catch(error) {
      console.error(error);
    }
  };

  runExample = async () => {
    const { contract, userAccount } = this.state;
    const gasEstimate = await contract.methods.set(12).estimateGas({ from: userAccount });
    console.log(gasEstimate+100);

    await contract.methods.set(10000000).send({ from: userAccount, gas: gasEstimate+400 });

    await contract.methods.get().call();

    //this.setState({ storageValue: response });
  };

  render() {
    return (
      <>
      {this.state.loading
        ? <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}><Spinner animation="grow" variant="dark" size="lg"/></span>
        :<Router>
        <MyNavbar logout = {this.logout} isLogged = {this.state.isLogged} />
        <Switch>
        <Route exact path="/" render={() => (
          this.state.isLogged
            ? <Dashboard
              allContent={this.state.allContent}
              articleContent={this.state.articleContent}
              projectContent={this.state.projectContent}
              paperContent={this.state.paperContent}
              username={this.state.username}
              isLogged = {this.state.isLogged}
              />
            : <Home
              allContent={this.state.allContent}
              articleContent={this.state.articleContent}
              projectContent={this.state.projectContent}
              paperContent={this.state.paperContent}
              isLogged = {this.state.isLogged}
              />
        )}/>
        <Route path = "/register" exact render={props => <Register createUser = {this.createUser}  />} />
        <Route path = "/login" exact render={({props, history}) => <Login history={history} show={this.state.show} loadUser = {this.loadUser} stopLoading={this.stopLoading}  />} />
        <Route path = "/addContent" exact render={props => <AddContent
          captureFile = {this.captureFile}
          updateContract = {this.updateContract} />}
        />
        <Route path = "/profile" exact render={props => <Profile
          username={this.state.username}

          web3={this.state.web3}
          userAllContent={this.state.userAllContent}
          userRemovedContent={this.state.userRemovedContent}
          userArticleContent={this.state.userArticleContent}
          userProjectContent={this.state.userProjectContent}
          userPaperContent={this.state.userPaperContent}
          isLogged = {this.state.isLogged}/>}
        />
        <Route path = "/content/:id" exact render={({match, props, history}) => <Content
          deleteContent = {this.deleteContent}
          restoreContent = {this.restoreContent}
          totalContent = {this.state.totalContent}
          match={match}
          props={props}
          history={history}
          userAccount = {this.state.userAccount}/>}
        />
        </Switch>
        </Router>
      }

      </>
    );
  }

}

export default App;
