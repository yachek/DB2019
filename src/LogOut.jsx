import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

export default class LogOut extends Component {

    componentDidMount() {
        fetch('/logout')
            .then(() => alert('Successfully LogOut!'))
            .catch((err) => {
                    console.log(err);
                    alert(err.status + ":" + err.message);
                }
            )
    }

    render() {
        return (
            <Redirect to='/'/>
        );
    }
}