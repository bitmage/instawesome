import React, {Component} from "react";
import firebase from 'firebase';
import {Grid, Cell, Snackbar} from 'react-mdl'
import '../../Styles/FormsStyles.css';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifyPassword: '',
            newPassword: '',
            confirmNewPassword: '',
            isSnackbarActive: false,
            snackbarText: ''
        };
        this.handleShowSnackbar = this.handleShowSnackbar.bind(this);
        this.handleTimeoutSnackbar = this.handleTimeoutSnackbar.bind(this);
    }


    createNewPassword() {
        const {newPassword, confirmNewPassword} = this.state;
        let user = firebase.auth().currentUser;
        let newerPassword = newPassword;

        this.setState({snackbarText: ''});

        if (newPassword === '' || confirmNewPassword === '') {
            this.setState({snackbarText: 'Must fill in all fields'});
            this.handleShowSnackbar();
            return;
        }
        if (newPassword !== confirmNewPassword) {
            this.setState({snackbarText: 'Passwords do not match'});
            this.handleShowSnackbar();
            return;
        }
        if (newPassword.length < 6) {
            this.setState({snackbarText: 'password must be at least 6 characters long'});
            this.handleShowSnackbar();
            return;
        }
        user.updatePassword(newerPassword)
            .then(() => {
                this.setState({snackbarText: 'Your password has been updated'});
                this.handleShowSnackbar()
            })
            .catch((error) => {
                this.setState({snackbarText: error.message});
                this.handleShowSnackbar();
            })
    }


    renderButton() {
        return (
            <button
                className="formButton"
                onClick={(e) => {
                    e.preventDefault();
                    this.createNewPassword();
                }}>
                <span className='buttonText'>
                    UPDATE
                </span>
            </button>
        )
    }


    renderSnackbar = () => {
        return (
            <Snackbar className='snackbar' active={this.state.isSnackbarActive} timeout={2000}
                      onTimeout={this.handleTimeoutSnackbar}>{this.state.snackbarText}</Snackbar>
        )
    };


    handleShowSnackbar() {
        this.setState({isSnackbarActive: true});
    }


    handleTimeoutSnackbar() {
        this.setState({isSnackbarActive: false});
    }


    handleInputTextChange = e => {
        this.setState({[e.target.name]: e.target.value});
        // console.log(`this is the current state ${this.state}`)
    };


    render() {
        return (
            <Grid>
                <Cell col={8} offsetDesktop={2} tablet={12} phone={12}>
                    <form className="formCont" action="#">
                        <div className='inputCont'>
                            <div className="formInputCont">
                                <div>
                                    <p className='inputLabel'>CHOOSE NEW PASSWORD</p>
                                </div>
                                <input
                                    name='newPassword'
                                    className="formInput"
                                    type="password"
                                    onChange={this.handleInputTextChange}
                                    placeholder=''
                                    value={this.state.newPassword}>
                                </input>
                            </div>
                            <div className="formInputCont">
                                <div>
                                    <p className='inputLabel'>CONFIRM NEW PASSWORD</p>
                                </div>
                                <input
                                    name='confirmNewPassword'
                                    className="formInput"
                                    type="password"
                                    onChange={this.handleInputTextChange}
                                    placeholder=''
                                    value={this.state.confirmNewPassword}>
                                </input>
                            </div>
                        </div>
                        <br/>
                        {this.renderButton()}
                        {this.renderSnackbar()}
                    </form>
                </Cell>
            </Grid>
        );
    }
}

export default ChangePassword;