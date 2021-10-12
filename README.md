# OwnerShip

IPMS (Intellectual Property Management System) Dapp to store Intellectual Properties such as projects, papers, articles in ethereum blockchain. This project is intended to provide services to the students. As of the implementation, this Dapp is to be hosted by the educational bodies with a private blockchain network inorder to achieve a feasible usage cost. 

![image](https://user-images.githubusercontent.com/48412820/136960360-8f02e87f-323f-4653-ae1d-ea4c7b787ee5.png)

## Features

- Inbuilt custom wallet management
- Minimalistic User Interface
- Completely Decentralised

Modifications and features to be [added](https://github.com/vikashraghavan/OwnerShip-Dapp/edit/main/ExpectedFeatures.md)

## Steps to run

#### Prerequisites: 
NPM and Ganache (Suggested to try it on the test net)

- Clone this repo
```
git clone https://github.com/vikashraghavan/OwnerShip-Dapp
```
- Modify the Ganache port number at truffle-config.js and then run
```
truffle migrate
```
- Modify the Ganache address at client/src/getWeb3.js
- Get into the client Directory and run
```
npm install
npm start
```
