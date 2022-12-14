import "./App.css"
import React from "react"
import Header from "../Header/header"
import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import EShopService from "../../repository/eshopRepository";
import Banks from "../Banks/BanksList/banks";
import ATMs from "../ATMs/ATMsList/atms";
import BankView from "../Banks/BankView/bankview"
import UserAdd from "../Banks/UserAdd/UserAdd";
import BankAdd from "../Banks/BankAdd/BankAdd";
import UserView from "../Banks/UserView/UserView"
import ATMLogin from "../ATMs/ATMLogin/ATMLogin";
import ATMAdd from "../ATMs/ATMAdd/ATMAdd";
import VehicleAdd from "../MoneyTransport/VehicleAdd/VehicleAdd";
import VehicleList from "../MoneyTransport/VehicleList/VehicleList";
class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            banks: [],
            atms: [],
            vehicles: [],
            selectedBank: "",
            selectedBankUsers: [],
            selectedBankUser: {},
            selectedATM: "",
            // selectedAccountNumber: "",
            // selectedAccountPassword: "",
            selectedAccountBalance: "",
            responseStatus: "",
        }
    }

    render() {
        return(
            <Router>
                <Header/>
                <main>
                    <div className="container">
                        <Routes>
                            <Route path={"/banks"} exact element={<Banks onSelect={this.selectBank} banks={this.state.banks} />}/>
                            <Route path={"/banks/add"} exact element={<BankAdd onAddBank={this.addBank}/>} />}/>
                            <Route path={"/"} exact element={<Banks onSelect={this.selectBank} banks={this.state.banks}/>}/>
                            <Route path={"/banks/view/:id"} exact element={
                                <BankView
                                    banks={this.state.banks}
                                    users={this.state.selectedBankUsers}
                                    term={this.state.selectedBank}
                                    selectUser={this.selectUser}
                                />
                            }
                            />
                            <Route path={"/banks/createuser"} exact element={<UserAdd term={this.state.selectedBank} onAddUser={this.addUser}/>}/>

                            <Route path={"/banks/:bankid/user/:userid"} exact element={<UserView createAccount={this.createAccount} bank={this.state.selectedBank} term={this.state.selectedBankUser}/>}/>
                            <Route path={"/atms/:atmid"} exact element={<ATMLogin selectedAccountBalance={this.state.selectedAccountBalance} responseStatus={this.state.responseStatus} login={this.login} withdraw={this.withdraw} deposit={this.deposit} term={this.state.selectedATM} />}/>
                            <Route path={"/atmAdd"} exact element={<ATMAdd onAddATM={this.addATM} banks={this.state.banks}/>}/>
                            <Route path={"/vehicleAdd"} exact element={<VehicleAdd onAddVehicle={this.addVehicle} banks={this.state.banks}/>}/>


                            <Route path={"/atms"} exact element={<ATMs selectATM={this.selectATM} atms={this.state.atms} />}/>


                            <Route path={"/moneyTransport"} exact element={<VehicleList vehicles={this.state.vehicles} />}/>

                            <Route path="*" element={<Navigate to ="/banks" />}/>
                        </Routes>
                    </div>
                </main>
            </Router>
        )
    }


    loadBanks = () => {
        EShopService.fetchBanks().then((data) => {
            this.setState({
                banks: data.data
            })
        })
    }

    loadATMs = () => {
        EShopService.fetchATMs().then((data) => {
            this.setState({
                atms: data.data
            })
        })
    }

    loadVehicles = () => {
        EShopService.fetchVehicles().then((data) => {
            this.setState({
                vehicles: data.data
            })
        })
    }


    selectBank = (id) => {
            this.setState({
                selectedBank: id
            })

            EShopService.fetchUsers(id).then((data) => {
                this.setState({
                    selectedBankUsers: data.data
                })
            })
    }

    selectATM = (id) => {
        console.log("function selectATM in app.js with id " + id)
        EShopService.fetchATM(id).then((data)=>{
            this.setState({
                selectedATM: data.data
            })
        })

    }

    selectUser = (bankId, userId) => {
        EShopService.fetchUser(bankId, userId).then((data)=>{
            this.setState({
                selectedBankUser: data.data
            })
        })
    }

    addUser = (selectedBank, name, surname, location) => {
        EShopService.addUserToBank(selectedBank, name, surname, location, "NORMAL_USER")
    }
    addBank = (name) => {
        EShopService.addBank(name)
            .then(()=>{
                this.loadBanks();
            })
    }

    addATM = (location, bankId) => {
        EShopService.addATM(location, bankId)
            .then(()=>{
                this.loadATMs();
            })
    }
    addVehicle = (location, bankId) => {
        EShopService.addVehicle(location, bankId)
            .then(()=>{
                this.loadVehicles();
            })
    }

    createAccount = (bankId, userId, password) => {
        EShopService.createAccount(bankId, userId, password)
            .then(()=>{
                this.loadBanks();
                this.loadATMs();
                this.selectUser(bankId, userId)
            })
    }


    login = (atmId, accountNumber, password) => {
        EShopService.login(atmId, accountNumber, password)
            .then((data)=>{
                this.setState({
                    responseStatus: data.data,
                    // selectedAccountNumber: accountNumber,
                    // selectedAccountPassword: password
                })
                this.selectATM(atmId)

        })
        EShopService.fetchAccountBalance(accountNumber)
            .then((data)=> {
                this.setState({
                    selectedAccountBalance: data.data
                })
            })
    }

    withdraw = (atmId, accountNumber, password, amount) => {
        EShopService.withdraw(atmId, accountNumber, password, amount)
        .then((data)=>{
            this.setState({
                responseStatus: data.data
            })
            this.selectATM(atmId)
        })

    }

    deposit = (atmId, accountNumber, password, amount) => {
        EShopService.deposit(atmId, accountNumber, password, amount)
            .then((data)=>{
                this.setState({
                    responseStatus: data.data
                })
                this.selectATM(atmId)
            })
    }




    componentDidMount() {
        this.loadBanks()
        this.loadATMs()
        this.loadVehicles()
    }
}

export default App